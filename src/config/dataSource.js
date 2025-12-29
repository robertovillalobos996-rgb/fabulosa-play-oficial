// =======================================================
// Fabulosa Play - Fuente de datos oficial (Vercel)
// =======================================================

// IMPORTANTE:
// - Este archivo hace que la app lea el JSON desde Vercel
// - NO usa GitHub Raw
// - Funciona en local y en producción

export const DATA_SOURCE_URL = "/data/fabulosa-data.json";

// -------------------------------------------------------
// Función principal para obtener y normalizar los datos
// -------------------------------------------------------
export async function fetchData() {
  try {
    console.log("DATA_SOURCE_URL:", DATA_SOURCE_URL);

    const response = await fetch(DATA_SOURCE_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    // Normalización para compatibilidad total
    const channels = data.tv_channels || data.channels || [];
    const stations = data.radios || data.radio || data.stations || [];

    console.log("Canales cargados:", channels.length);
    console.log("Radios cargadas:", stations.length);

    return {
      channels,
      stations,
      raw: data,
    };
  } catch (error) {
    console.error("Error cargando datos:", error);
    return {
      channels: [],
      stations: [],
      raw: null,
      error,
    };
  }
}
