const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler'); 

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow Vite frontend
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set('socketio', io);
// Middleware
app.use(cors({ origin: '*', credentials: true })); // Allow all origins for dev
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/activity', require('./routes/activity'));

// Socket.io Setup
socketHandler(io);

io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Join a specific board room
    socket.on('join_board', (boardId) => {
        socket.join(boardId);
        console.log(`User ${socket.id} joined board: ${boardId}`);
    });

    // Leave board room
    socket.on('leave_board', (boardId) => {
        socket.leave(boardId);
    });

    socket.on('disconnect', () => {
        console.log('Socket Disconnected');
    });
    
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));