const http = require('http');
const fs = require('fs');
// HTTP服务器
const server = http.createServer((req, res) => {
  // 实例化 URL 类
  const url = new URL(req.url, 'http://localhost:1000');
  const { pathname } = url;
  // 路由
  if(pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(fs.readFileSync('./index.html'));
  }else if(pathname === '/demo.mp4') {
    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    res.end(fs.readFileSync('./demo.mp4'));
  }else if(pathname === '/client.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync('./client.js'));
  }
});
server.listen(1000);