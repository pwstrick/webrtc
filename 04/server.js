/**
 * 信令服务器
 */
const http = require('http');
const fs = require('fs');
const { Server } = require("socket.io");

// HTTP服务器
const server = http.createServer((req, res) => {
  // 实例化 URL 类
  const url = new URL(req.url, 'http://localhost:1234');
  const { pathname } = url;
  // 路由
  if(pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('./index.html'));
  }else if(pathname === '/socket.io.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync('./socket.io.js'));
  }else if(pathname === '/client.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync('./client.js'));
  }
});

// Socket
const io = new Server(server);
const roomId = 'living room';
io.on('connection', (socket) => {
  // 指定房间
  socket.join(roomId);
  // 发送消息
  socket.on('message', (data) => {
		console.log(data);
    // 发消息给房间内的其他人
		socket.to(roomId).emit('message', data);
	});
});

// 监控端口
server.listen(1234);