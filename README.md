# 3D Coin Collector Game

A real-time multiplayer 3D game where players compete to collect coins in a shared environment. Built with **Three.js** for immersive 3D graphics and **Socket.IO** for fast, reliable networking.

## Features

- **Room Management:**  
  Create and join game rooms for private or public matches.

- **Spectator Mode:**  
  Join any room as a spectator and watch the action live.

- **Real-Time Multiplayer:**  
  Player movements, coin pickups, and game events are synced instantly across all clients.

- **Reconnect on Connection Error:**  
  Automatic reconnection lets players resume their session if their connection drops.

- **Analog Movement for Mobile:**  
  Smooth analog controls for mobile devices, including rotation and movement.

- **3D Environment:**  
  Built with Three.js for realistic graphics and interactive gameplay.

## Getting Started

1. **Install dependencies:**

   ```
   npm install
   ```

2. **Start the backend server:**  
   The backend Node.js code is available at:  
   [Backend Repository](https://github.com/DavidMeseha/Game-v1-server)  
   For the full experience, clone and install the backend:

   ```
   npm install
   npm run dev
   ```

3. **Start the client:**

   ```
   npm run dev
   ```

4. **Open your browser:**  
   Visit `http://localhost:3000` to play.

## How to Play

- **Enter Your Name:**  
  Write a name that will represent you on players screen.

- **Create a Room:**  
  Start a new game and invite friends.

- **Join a Room:**  
  Enter a room code to join an existing match.

- **Spectate:**  
  Watch games in progress without participating.

- **Collect Coins:**  
  Move your character to pick up coins and score points.

- **Mobile Controls:**  
  Use the on-screen analog stick for movement and rotation.

## Technologies Used

- [Three.js](https://threejs.org/) – 3D rendering
- [Socket.IO](https://socket.io/) – Real-time networking
- [Blender](https://www.blender.org/) – 3D designe tool
- React – UI framework
- Node.js – Backend server
- Blender - To creat .GLTF map
