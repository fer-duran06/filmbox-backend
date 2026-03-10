import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";
import { corsHeaders, handlePreflight } from "@/lib/cors";

export async function OPTIONS() {
  return handlePreflight();
}

/**
 * GET /api/movies/search?q=inception&page=1
 * Busca películas por nombre.
 * Proxy: Frontend → Este endpoint → TMDB /search/movie
 *
 * Query params:
 * - q: término de búsqueda (requerido)
 * - page: número de página (default: 1)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = searchParams.get("page") || "1";

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "El parámetro 'q' es requerido para la búsqueda" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const data = await tmdbFetch({
      endpoint: "/search/movie",
      params: { query: query.trim(), page },
    });

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("[API] Error en /movies/search:", error);

    return NextResponse.json(
      { error: "No se pudieron buscar las películas" },
      { status: 500, headers: corsHeaders() }
    );
  }
}