import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";
import { corsHeaders, handlePreflight } from "@/lib/cors";

export async function OPTIONS() {
  return handlePreflight();
}

/**
 * GET /api/movies/trending
 * Obtiene las películas en tendencia de la semana.
 * Proxy: Frontend → Este endpoint → TMDB /trending/movie/week
 *
 * Query params opcionales:
 * - page: número de página (default: 1)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const data = await tmdbFetch({
      endpoint: "/trending/movie/week",
      params: { page },
    });

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("[API] Error en /movies/trending:", error);

    return NextResponse.json(
      { error: "No se pudieron obtener las películas en tendencia" },
      { status: 500, headers: corsHeaders() }
    );
  }
}