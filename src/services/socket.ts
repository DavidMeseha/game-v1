import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(import.meta.env.VITE_SOCKET_SERVER);
  }

  // Emit methods
  emitCreateRoom(data: { isSpectator: boolean; name: string }) {
    this.socket.emit("createRoom", data);
  }
  emitJoinRoom(data: { roomName: string; isSpectator: boolean; name: string }) {
    this.socket.emit("joinRoom", data);
  }
  emitCancelRoom() {
    this.socket.emit("cancelRoom");
  }
  emitLeaveRoom() {
    this.socket.emit("leaveRoom");
  }
  emitStartGame() {
    this.socket.emit("start");
  }
  emitCoinPick(data: { coinPosition: [number, number, number] }) {
    this.socket.emit("coinPicked", data);
  }
  emitReconnect(data: { playerId: string; roomId: string }) {
    this.socket.emit("reconnect", data);
  }
  emitPlayerMove(data: {
    position: [number, number, number];
    rotation: number;
  }) {
    this.socket.emit("move", data);
  }

  // Listeners
  on(event: string, cb: (...args: any[]) => void) {
    this.socket.on(event, cb);
  }
  off(event: string, cb: (...args: any[]) => void) {
    this.socket.off(event, cb);
  }
  // close() {
  //   this.socket.close();
  // }
}

const socketService = new SocketService();
export default socketService;
