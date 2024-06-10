from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


import json

class MyConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        if user:
            self.accept()
            async_to_sync(self.channel_layer.group_add)(
                'broadcast_group',
                self.channel_name
            )
            print('Connection established')
        else:
            self.close()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            'broadcast_group',
            self.channel_name
        )

    def receive(self, text_data):
        user = self.scope['user']
        if user:
            try:
                text_data_incoming = json.loads(text_data)

                async_to_sync(self.channel_layer.group_send)(
                    'broadcast_group',
                    {
                        'type': 'chat_message',
                        'message': text_data_incoming
                    }
                )
            except json.JSONDecodeError:
                self.send(text_data=json.dumps({'error': 'Invalid JSON format'}))
                self.close()
        else:
            self.send(text_data=json.dumps({'error': 'Authentication failed'}))
            self.close()

    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

