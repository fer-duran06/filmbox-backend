import { NextResponse } from "next/server";

/**
 * Agrega headers CORS a la respuesta.
 * Solo permite requests desde el origin configurado en CORS_ORIGIN.
 */
export function corsHeaders(): HeadersInit {
  const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

/**
 * Maneja preflight requests (OPTIONS).
 * Los navegadores envían esto antes de un POST/DELETE.
 */
export function handlePreflight(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}