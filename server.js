const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
  console.log('✅ A user connected');

  socket.on('set username', (name) => {
    users[socket.id] = name;
  });

  socket.on('chat message', function(data) {
    // Re-broadcast message to all clients
    io.emit('chat message', {
      user: data.user || users[socket.id] || 'Anonymous',
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ ${users[socket.id] || 'A user'} disconnected`);
    delete users[socket.id];
  });
});

const PORT = 5500;
http.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});