import asyncio
import logging
import websockets

from django.core.management.base import BaseCommand

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

class Command(BaseCommand):
    help = 'Starts a WebSocket server'

    def handle(self, *args, **options):
        port = 8765  # Port to listen on
        start_server = websockets.serve(chat_server, "localhost", port)
        logging.info(f"Le serveur démarre sur le port : {port}")
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    Command().handle()