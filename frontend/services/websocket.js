// services/websocket.js
class WebSocketService {
    static instance = null;
    callbacks = {};
  
    static getInstance() {
      if (!WebSocketService.instance) {
        WebSocketService.instance = new WebSocketService();
      }
      return WebSocketService.instance;
    }
  
    constructor() {
      this.socketRef = null;
    }
  
    connect(token) {
      const path = `ws://localhost:8000/ws/chat/?token=${token}`;
      this.socketRef = new WebSocket(path);
  
      this.socketRef.onopen = () => {
        console.log('WebSocket open');
      };
  
      this.socketRef.onmessage = e => {
        this.socketNewMessage(e.data);
      };
  
      this.socketRef.onerror = e => {
        console.log('WebSocket error', e.message);
      };
  
      this.socketRef.onclose = () => {
        console.log('WebSocket closed');
        this.connect(token);
      };
    }
  
    socketNewMessage(data) {
      const parsedData = JSON.parse(data);
      const callback = this.callbacks[parsedData.command];
      if (callback) {
        callback(parsedData);
      }
    }
  
    addCallbacks(command, callback) {
      this.callbacks[command] = callback;
    }
  
    sendMessage(data) {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
  
    state() {
      return this.socketRef.readyState;
    }
  
    waitForSocketConnection(callback) {
      const socket = this.socketRef;
      const recursion = this.waitForSocketConnection.bind(this);
      setTimeout(() => {
        if (socket.readyState === 1) {
          console.log('Connection is made');
          if (callback) {
            callback();
          }
          return;
        } else {
          console.log('Waiting for connection...');
          recursion(callback);
        }
      }, 1); // wait 1 millisecond for the connection...
    }
  }
  
  const WebSocketInstance = WebSocketService.getInstance();
  
  export default WebSocketInstance;
  