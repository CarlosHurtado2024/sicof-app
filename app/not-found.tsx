import UnderConstruction from "@/components/under-construction"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Página no encontrada o en construcción - SICOF",
}

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center">
            <UnderConstruction
                title="Sección no encontrada"
                message="La página que busca no existe o está siendo desarrollada para mejorar nuestro servicio."
            />
        </div>
    )
}
