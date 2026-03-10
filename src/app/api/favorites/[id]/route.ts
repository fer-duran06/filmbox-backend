import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { corsHeaders, handlePreflight } from "@/lib/cors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return handlePreflight();
}

/**
 * DELETE /api/favorites/:id
 * Elimina una película de los favoritos por su ID interno.
 * Data source: PostgreSQL (tabla favorites)
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de favorito inválido" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const result = await pool.query(
      "DELETE FROM favorites WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Favorito no encontrado" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { message: "Favorito eliminado correctamente", deleted: result.rows[0] },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("[API] Error en DELETE /favorites/[id]:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar el favorito" },
      { status: 500, headers: corsHeaders() }
    );
  }
}