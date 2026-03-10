import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { corsHeaders, handlePreflight } from "@/lib/cors";

export async function OPTIONS() {
  return handlePreflight();
}

/**
 * GET /api/favorites
 * Lista todas las películas marcadas como favoritas.
 * Data source: PostgreSQL (tabla favorites)
 */
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM favorites ORDER BY created_at DESC"
    );

    return NextResponse.json(
      { results: result.rows, total: result.rowCount },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("[API] Error en GET /favorites:", error);

    return NextResponse.json(
      { error: "No se pudieron obtener los favoritos" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

/**
 * POST /api/favorites
 * Guarda una película como favorita en PostgreSQL.
 *
 * Body esperado (JSON):
 * {
 *   tmdb_id: number,
 *   title: string,
 *   poster_path: string | null,
 *   overview: string | null,
 *   vote_average: number | null,
 *   release_date: string | null
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.tmdb_id || !body.title) {
      return NextResponse.json(
        { error: "Los campos 'tmdb_id' y 'title' son requeridos" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const result = await pool.query(
      `INSERT INTO favorites (tmdb_id, title, poster_path, overview, vote_average, release_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (tmdb_id) DO NOTHING
       RETURNING *`,
      [
        body.tmdb_id,
        body.title,
        body.poster_path || null,
        body.overview || null,
        body.vote_average || null,
        body.release_date || null,
      ]
    );

    // Si no insertó nada, ya existía
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Esta película ya está en favoritos" },
        { status: 409, headers: corsHeaders() }
      );
    }

    return NextResponse.json(result.rows[0], {
      status: 201,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("[API] Error en POST /favorites:", error);

    return NextResponse.json(
      { error: "No se pudo guardar el favorito" },
      { status: 500, headers: corsHeaders() }
    );
  }
}