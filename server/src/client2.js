const WebSocket = require('uws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Sucessful conected to the server');
  ws.send('Hi serwer i am client 2');

  ws.on('message', (message) => {
  
    console.log(message);
    
  });
});