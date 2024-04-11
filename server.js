const express = require('express');
const mongoose = require('mongoose');
const curdRoutes = require('./routes/myRoute');
const cors = require('cors');
const app = express();
const PORT = 8000;
const IP = '192.168.1.21';
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http'); // Import http module for creating server
const socketIO = require('socket.io'); // Import Socket.IO module
app.use(bodyParser.json());
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use("/uploads", express.static(path.join(__dirname, './uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/node-mongodb-crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use routes
app.use('/api/', curdRoutes);

// Create HTTP server
const server = http.createServer(app);
const io = socketIO(server);



const connectedUsers = {}; 
const alluser = [];
io.on('connection', (socket) => {

  socket.on('user_connected', (userId) => {

    connectedUsers[userId] = socket;
    const exituser = alluser.includes(userId);
    if(!exituser){
      alluser.push(userId)
    }
     if(alluser){
      socket.emit('user_connected',alluser);
     }

    
  });

  socket.on('private_message', (message) => {
    console.log("private_message",message)
    const { senderId, recipientId, content } = message;
    console.log("usermsg",message)

    const recipientSocket = connectedUsers[recipientId];
    if (recipientSocket) {
      recipientSocket.emit('private_message', { senderId, content });
    } else {
      console.log('Recipient is not connected');
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket);
    delete connectedUsers[userId];
    console.log(`User ${userId} disconnected`);
  });
});

// Start the server
server.listen(PORT, IP, () => {
  console.log(`Server is running on port http://${IP}:${PORT}`);
});
