from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

project_messages = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join_project')
def on_join(data):
    project_id = data['project_id']
    username = data['username']
    
    # Join the project room
    join_room(project_id)
    
    # Retrieve message history for this project
    project_history = project_messages.get(project_id, [])
    
    # Emit message history to the joining user
    emit('message_history', {
        'messages': project_history
    }, room=request.sid)
    
    # Broadcast join notification
    emit('user_joined', {
        'username': username,
        'message': f'{username} has joined the project chat'
    }, room=project_id)

@socketio.on('leave_project')
def on_leave(data):
    project_id = data['project_id']
    username = data['username']
    
    leave_room(project_id)
    
    # Broadcast leave notification
    emit('user_left', {
        'username': username,
        'message': f'{username} has left the project chat'
    }, room=project_id)

@socketio.on('send_message')
def handle_message(data):
    project_id = data['project_id']
    message = {
        'id': str(uuid.uuid4()),
        'sender': data['sender'],
        'text': data['text'],
        'timestamp': data['timestamp']
    }
    
    # Store message in project history
    if project_id not in project_messages:
        project_messages[project_id] = []
    project_messages[project_id].append(message)
    
    # Broadcast message to all users in the project room
    emit('receive_message', message, room=project_id)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)