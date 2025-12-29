export async function fetchData() {
  const res = await fetch("/data/fabulosa-data.json");

  if (!res.ok) {
    throw new Error("No se pudo cargar el JSON");
  }

  const data = await res.json();

  return {
    stations: data.radio || data.radios || [],
    channels: data.tv_channels || data.channels || [],
  };
}
