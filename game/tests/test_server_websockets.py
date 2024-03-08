import asyncio
import websockets
import unittest

class ServerWebSocketTest(unittest.IsolatedAsyncioTestCase):
    async def test_websocket_connection(self):
        uri = "ws://localhost:8765"
        async with websockets.connect(uri) as websocket:
            message = "Hello, server!"
            await websocket.send(message)
            response = await websocket.recv()
            self.assertEqual(message, response)

    async def test_stop_server(self):
        uri = "ws://localhost:8765"
        async with websockets.connect(uri) as websocket:
            await websocket.send("STOP_SERVER")
            # Attendre que le serveur traite la commande d'arrêt
            await asyncio.sleep(1)

if __name__ == "__main__":
    unittest.main()
