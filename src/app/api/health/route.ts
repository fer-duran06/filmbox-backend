import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { corsHeaders } from "@/lib/cors";

/**
 * GET /api/health
 * Verifica que el backend y la base de datos estén funcionando.
 * Útil para Docker healthcheck y monitoreo.
 */
export async function GET() {
  try {
    // Verificar conexión a PostgreSQL
    const dbResult = await pool.query("SELECT NOW()");
    const dbTime = dbResult.rows[0].now;

    return NextResponse.json(
      {
        status: "ok",
        service: "filmbox-backend",
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          serverTime: dbTime,
        },
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("[API] Error en /health:", error);

    return NextResponse.json(
      {
        status: "error",
        service: "filmbox-backend",
        timestamp: new Date().toISOString(),
        database: { connected: false },
      },
      { status: 503, headers: corsHeaders() }
    );
  }
}