export function savePlayerReconnectionData(playerId: string, roomId: string) {
  localStorage.setItem("reconnect", JSON.stringify({ playerId, roomId }));
}

export function getPlayerReconnectionData(): {
  playerId: string;
  roomId: string;
} | null {
  const stringData = localStorage.getItem("reconnect");
  return stringData ? JSON.parse(stringData) : null;
}

export function clearPlayerReconnectionData() {
  localStorage.removeItem("reconnect");
}
