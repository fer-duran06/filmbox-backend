/**
 * Cliente para la API de TMDB.
 * Todas las llamadas se hacen server-side.
 * La API Key NUNCA se expone al frontend.
 */

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  console.warn("[TMDB] TMDB_API_KEY no está configurada en las variables de entorno");
}

interface TmdbRequestOptions {
  endpoint: string;
  params?: Record<string, string>;
}

/**
 * Hace una petición GET a TMDB con la API Key inyectada.
 * @param endpoint - Ruta del endpoint (ej: "/trending/movie/week")
 * @param params - Query params adicionales
 * @returns JSON de la respuesta
 */
export async function tmdbFetch<T>({ endpoint, params = {} }: TmdbRequestOptions): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  // Inyectar API Key — esto se hace server-side
  url.searchParams.set("api_key", TMDB_API_KEY || "");
  // Respuestas en español para mejor UX
  url.searchParams.set("language", "es-MX");

  // Agregar params adicionales
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

 const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Sin cache para siempre obtener datos frescos
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TMDB Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}