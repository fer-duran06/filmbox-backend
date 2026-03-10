import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";
import { corsHeaders, handlePreflight } from "@/lib/cors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return handlePreflight();
}

/**
 * GET /api/movies/:id
 * Obtiene el detalle completo de una película.
 * Proxy: Frontend → Este endpoint → TMDB /movie/{id}
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de película inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const data = await tmdbFetch({
      endpoint: `/movie/${id}`,
      params: { append_to_response: "credits,videos" },
    });

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("[API] Error en /movies/[id]:", error);

    return NextResponse.json(
      { error: "No se pudo obtener el detalle de la película" },
      { status: 500, headers: corsHeaders() }
    );
  }
}