import http from 'http'

const server = http.createServer()
import WebSocket, { WebSocketServer } from 'ws'

const startWebSocketServer = () => {
  console.log('Starting websocket server...')

  const wss = new WebSocketServer({ server, port: 6050 })

  let currentFile = false

  // if we have problems with broken connections:
  // https://github.com/websockets/ws#how-to-detect-and-close-broken-connections

  // for every new connection
  wss.on('connection', (ws) => {
    // for newly connected clients we send them the current file as a welcoming present
    ws.send(JSON.stringify({ image: currentFile }))

    ws.on('message', (message) => {
      // check what type of message it is
      if (message === 'clear') {
        currentFile = false
      } else {
        // save image in current file for all clients that disconnect shortly after
        currentFile = message

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ image: currentFile }))
          }
        })
      }
    })
  })

  wss.on('error', (e) => {
    console.log('error: ', e)
  })
}

export default startWebSocketServer
