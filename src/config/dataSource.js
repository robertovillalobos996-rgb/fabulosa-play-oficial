// URL del archivo JSON externo con los datos de canales y radio
export const DATA_SOURCE_URL = 'https://raw.githubusercontent.com/robertovillalobos996-rgb/fabulosa-data/main/fabulosa-data-final.json';

// Función para obtener los datos normalizados
export async function fetchData() {
  console.log("DATA_SOURCE_URL", DATA_SOURCE_URL);

  const response = await fetch(DATA_SOURCE_URL, { cache: "no-store" });
  const data = await response.json();

  // Normalizar las llaves: acepta channels/tv_channels y stations/radio/radios
  const channels = data.channels || data.tv_channels || [];
  const stations = data.stations || data.radio || data.radios || [];

  console.log("channels", channels.length);
  console.log("stations", stations.length);

  return { channels, stations };
}
