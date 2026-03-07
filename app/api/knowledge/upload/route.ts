import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import pdf from "pdf-parse";

// Function to call Gemini for embeddings
async function getGeminiEmbedding(text: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set en tus variables de entorno locales.");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "models/gemini-embedding-001",
            content: { parts: [{ text }] },
            outputDimensionality: 768
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini Embed API Error:", errText);
        throw new Error("Failed to generate embedding");
    }

    const data = await response.json();
    return data.embedding.values;
}

// Function to chunk text
function chunkText(text: string) {
    const chunkSize = 3000;
    const overlap = 400;

    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.substring(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión primero." }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) {
            return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Extraer texto del PDF 
        const pdfData = await pdf(buffer);
        const textContext = pdfData.text;

        if (!textContext.trim()) {
            return NextResponse.json({ error: "No se pudo extraer texto del PDF (podría ser una imagen escaneada)." }, { status: 400 });
        }

        // 2. Subir PDF al bucket de Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('conocimiento')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return NextResponse.json({ error: "No se pudo guardar el archivo en el almacenamiento." }, { status: 500 });
        }

        // 3. Guardar metadata en BD public.knowledge_documents
        const { data: docData, error: docError } = await supabase
            .from("knowledge_documents")
            .insert({
                title: file.name.replace('.pdf', ''),
                filename: file.name,
                created_by: user.id,
                storage_path: filePath
            })
            .select()
            .single();

        if (docError) {
            // Rollback storage if db fails
            await supabase.storage.from('conocimiento').remove([filePath]);
            throw docError;
        }

        // 4. Dividir texto en chunks (fragmentos)
        const chunks = chunkText(textContext);

        // 5. Obtener embeddings y guardar en BD document_chunks
        let processedChunks = 0;
        for (const chunk of chunks) {
            try {
                const embedding = await getGeminiEmbedding(chunk);

                const { error: insertError } = await supabase
                    .from("document_chunks")
                    .insert({
                        document_id: docData.id,
                        content: chunk,
                        embedding: embedding
                    });

                if (insertError) throw insertError;

                processedChunks++;
            } catch (embError: any) {
                console.error("Failed to embed chunk", embError);
                // Si el error es por la API key de Gemini, detenemos todo y lo reportamos
                if (embError.message?.includes("GEMINI_API_KEY")) {
                    return NextResponse.json({ error: "Falta configurar GEMINI_API_KEY en tu .env.local. Por favor añádela y reinicia el servidor." }, { status: 500 });
                }
            }
        }

        if (chunks.length > 0 && processedChunks === 0) {
            return NextResponse.json({ error: "No se pudo generar ningún fragmento indexado debido a un error con la API de IA." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            documentId: docData.id,
            chunksProcessed: processedChunks
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("knowledge_documents")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión primero." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Se requiere el ID del documento." }, { status: 400 });
        }

        // Obtener el path del storage
        const { data: doc, error: fetchError } = await supabase
            .from("knowledge_documents")
            .select("storage_path")
            .eq("id", id)
            .single();

        if (fetchError) throw fetchError;

        // Eliminar de Storage
        if (doc?.storage_path) {
            const { error: storageError } = await supabase.storage
                .from("conocimiento")
                .remove([doc.storage_path]);

            if (storageError) {
                console.error("No se pudo eliminar de storage:", storageError);
            }
        }

        // Eliminar de la base de datos (se hace en cascada con los chunks)
        const { error: dbError } = await supabase
            .from("knowledge_documents")
            .delete()
            .eq("id", id);

        if (dbError) throw dbError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
