const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3000 });

const guests = [];

function sendResponse(method, nickname, message, date) {
  const data = {
    method,
    nickname,
    message,
    date,
  };

  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

server.on('connection', (ws) => {
  ws.on('message', (data) => {
    const obj = JSON.parse(data);
    if (obj.method === 'login') {
      if (guests.includes(obj.nickname)) {
        sendResponse('login', obj.nickname, 'Already exists');
      } else {
        guests.push(obj.nickname);
        sendResponse('login', obj.nickname, 'Login successfully');
      }
    } else if (obj.method === 'send') {
      if (obj.message !== '') {
        sendResponse('send', obj.nickname, obj.message, obj.date);
      }
    } else if (obj.method === 'users') {
      sendResponse('users', obj.nickname, guests);
    } else if (obj.method === 'logout') {
      guests.splice(guests.indexOf(obj.nickname), 1);
      sendResponse('logout', obj.nickname);
      ws.close();
    }
  });
});
