/* eslint-disable no-undef */
const osc = require('osc')

require('dotenv').config()

function startWebSocketServer() {
  // Server listening to a UDP port
  // for example from reacTIVision app

  // Create an OSC Server and bind it to port 3333
  const udpPort = new osc.UDPPort({
    localAddress: '127.0.0.1',
    localPort: 3333
  })

  // Listen for incoming OSC messages
  udpPort.on('message', function (oscMessage) {
    console.log('Received OSC message:', oscMessage)
    // Process the OSC message as needed
  })

  // Start the OSC Server
  udpPort.open()

  // Handle errors
  udpPort.on('error', function (error) {
    console.error('Error:', error)
  })

  // Gracefully close the server on process exit
  process.on('SIGINT', function () {
    console.log('Closing OSC server')
    udpPort.close()
    process.exit()
  })
}

module.exports = startWebSocketServer
