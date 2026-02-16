const socketHandler = (io) => {
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

        // Handle typing indicators or other events here if needed
        socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });
    });
};

module.exports = socketHandler;