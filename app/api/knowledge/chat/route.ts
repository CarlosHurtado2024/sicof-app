import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    if (!response.ok) throw new Error("Failed to generate embedding");

    const data = await response.json();
    return data.embedding.values;
}

async function callGemini(prompt: string, systemPrompt: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set en tus variables de entorno locales.");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini Error:", errorText);
        throw new Error(`Failed to generate text: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No hay respuesta.";
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado. Inicia sesión primero." }, { status: 401 });
        }

        const { question, documentId } = await req.json();
        if (!question) {
            return NextResponse.json({ error: "La pregunta es requerida." }, { status: 400 });
        }

        let queryEmbedding;
        try {
            queryEmbedding = await getGeminiEmbedding(question);
        } catch (e: any) {
            console.error("Embedding error:", e);
            return NextResponse.json({ error: `Error de IA al generar embedding de la pregunta: ${e.message}` }, { status: 500 });
        }

        // 2. Buscar en Supabase pgvector fragmentos relevantes
        const { data: chunks, error: matchError } = await supabase.rpc('match_document_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3, // Umbral de similitud (ajustable de 0 a 1)
            match_count: 5 // Top 5 fragmentos más similares
        });

        if (matchError) throw matchError;

        // 3. Filtrar y construir el contexto
        let contextText = "";
        if (chunks && chunks.length > 0) {
            // Si se proporcionó un ID de documento específico, filtra solo esos chunks, sino usa todos
            const filteredChunks = documentId ? chunks.filter((c: any) => c.document_id === documentId) : chunks;

            // Concatena con separador
            contextText = filteredChunks.map((c: any) => c.content).join("\n\n---\n\n");
        }

        if (!contextText.trim()) {
            return NextResponse.json({ answer: "🚫 No encontré información relevante en la base de datos de documentos para responder a esta pregunta matemática/legal específica. Intenta reformularla o sube un documento que aborde este tema." });
        }

        // 4. Preguntarle al LLM pasándole el contexto como base de conocimiento (RAG)
        const systemPrompt = `Eres Komi Legal, tu asistente jurídico experto de la Comisaría de Familia.
REGLA DE ORO: Tienes que responder estrictamente basándote en la información legal proporcionada a continuación. No inventes procedimientos. Si la información solicitada no aparece textualmente ni inferible en el texto proporcionado, di que no tienes información suficiente en los documentos subidos. Cita y argumenta jurídicamente si el texto lo permite.`;

        const prompt = `--- CONTEXTO LEGAL RECUPERADO DE LOS DOCUMENTOS ---
${contextText}
--- FIN DEL CONTEXTO LEGAL ---

Pregunta del usuario: ${question}

Responde de manera profesional.`;

        const answer = await callGemini(prompt, systemPrompt);

        // Devolvemos la respuesta final junto con una lista de IDs de documentos que sirvieron como fuente
        return NextResponse.json({
            answer,
            sources: Array.from(new Set(chunks?.map((c: any) => c.document_id) || []))
        });

    } catch (error: any) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
