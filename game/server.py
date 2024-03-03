import asyncio
import websockets
import logging

logging.basicConfig(level=logging.INFO)

clients = set()

async def chat_server(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            message_with_username = f"{message}"
            for client in clients:
                await client.send(message_with_username)
    finally:
        clients.remove(websocket)

async def main():
    port = 8765
    start_server = websockets.serve(chat_server, "localhost", port)
    logging.info(f"Le serveur démarre sur le port : {port}")
    await start_server

asyncio.run(main())
