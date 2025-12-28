export function createPageUrl(page) {
  const map = {
    Splash: "/",
    Home: "/home",
    Channels: "/channels",
    Live: "/live",
    Radio: "/radio",
    PSCInforma: "/psc",
    Player: "/player",
  };
  return map[page] || "/home";
}
