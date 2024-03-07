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

if __name__ == "__main__":
    unittest.main()
