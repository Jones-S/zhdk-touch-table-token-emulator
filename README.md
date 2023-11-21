# Token Emulator

This app serves as an intermediate proxy layer between a touch table application and the reacTIVision app: https://reactivision.sourceforge.net/

The reacTIVision app sends marker information via OSC signal (TUIO respectively): https://www.tuio.org/?specification

The Token Tracker app sets up server to listen to the UDP protocol receiving the OSC messages.
At the same time it sets up a websocket server on port 6050 and acts as a proxy, sanitizing and forwarding the messages (sending them as JSON in a more readable format).

## Building and Distribution

The app is built with electron-builder. When sending a ZIP or DMG installer to somebody, the app will not work because of OS X quarantine.

To disable the quarantine do this:

```bash
# disable the quarantine set by GateKeeper in macOS
$ xattr -cr /Users/[filePath]/Token\ Emulator.app
```

## Message and Message formats

The messages look like this:

```JSON
// sent if the session ids within the alive message type change
{ type: '/tracker/add', args: { sessionId: 4 } }

{ type: '/tracker/remove', args: { sessionId: 4 } }
```

````JSON
{
  type: '/tracker/add',
  args: {
    id: 3,
    x: 0,
    y: 0,
    relativeX: 0,
    relativeY: 0,
    rotation: 0
  }
}
```

```JSON
{
  type: '/tracker/update',
  args: {
    sessionId: 2,
    id: 2,
    x: 142,
    y: 634,
    relativeX: 0.6030212044715881,
    relativeY: 0.41140735149383545,
    rotation: 156.60326030896937
  }
}
````
