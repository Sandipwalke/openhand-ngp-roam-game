import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Store connected players
const players = new Map()

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`)
  
  socket.on('playerJoin', (data) => {
    const playerData = {
      id: data.id,
      socketId: socket.id,
      name: data.name,
      position: data.position,
      rotation: data.rotation,
      speed: data.speed,
      vehicleId: data.vehicleId
    }
    
    players.set(socket.id, playerData)
    
    // Notify others
    socket.broadcast.emit('playerJoined', {
      id: data.id,
      name: data.name,
      position: data.position,
      rotation: data.rotation
    })
    
    // Send existing players to new player
    players.forEach((player, socketId) => {
      if (socketId !== socket.id) {
        socket.emit('playerJoined', {
          id: player.id,
          name: player.name,
          position: player.position,
          rotation: player.rotation
        })
      }
    })
    
    console.log(`Player ${data.name} (${data.id}) joined`)
  })
  
  socket.on('playerMove', (data) => {
    const player = players.get(socket.id)
    if (player) {
      player.position = data.position
      player.rotation = data.rotation
      player.speed = data.speed
      
      // Broadcast to others
      socket.broadcast.emit('playerUpdate', {
        id: data.id,
        position: data.position,
        rotation: data.rotation,
        speed: data.speed
      })
    }
  })
  
  socket.on('disconnect', () => {
    const player = players.get(socket.id)
    if (player) {
      io.emit('playerLeft', player.id)
      players.delete(socket.id)
      console.log(`Player ${player.name} disconnected`)
    }
  })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`)
})