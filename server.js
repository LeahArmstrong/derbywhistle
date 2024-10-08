const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Define penalty types and colors
const penalties = [
  { name: 'Back Block', letter: 'B' },
  { name: 'High Block', letter: 'A' },
  { name: 'Low Block', letter: 'L' },
  { name: 'Head Block', letter: 'H' },
  { name: 'Forearm', letter: 'F' },
  { name: 'Leg Block', letter: 'E' },
  { name: 'Illegal Contact', letter: 'C' },
  { name: 'Direction', letter: 'D' },
  { name: 'Multiplayer', letter: 'M' },
  { name: 'Illegal Position', letter: 'P' },
  { name: 'Cut', letter: 'X' },
  { name: 'Interference', letter: 'N' },
  { name: 'Illegal Procedure', letter: 'I' },
  { name: 'Misconduct', letter: 'G' },
];

const colors = ['red', 'black', 'purple', 'white', 'blue', 'green'];

// Randomly select a penalty, color, and number
function getRandomData() {
  const penalty = penalties[Math.floor(Math.random() * penalties.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const number = Math.floor(Math.random() * 9999) + 1;
  return { penalty, color, number };
}

// Emit data at random intervals between 10 and 30 seconds
function emitRandomData() {
  const interval = Math.floor(Math.random() * (15000 - 10000 + 1)) + 10000;
  setTimeout(() => {
    io.emit('update', getRandomData());
    emitRandomData(); // recursive call to continue the process
  }, interval);
}

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('update', getRandomData());

  // Listen for manual refresh requests from the client
  socket.on('requestUpdate', () => {
    socket.emit('update', getRandomData());
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

emitRandomData();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

