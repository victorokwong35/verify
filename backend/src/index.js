const loaders = require("./loaders");
const express = require("express");
const http = require("http");
const SocketService = require("./services/SocketService");
const { Server } = require("socket.io")
const cookieParser = require("cookie-parser");
const app = express();


async function startServer() {
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"]}});
  await loaders(app);

  // , 
    

  const onConnection = (socket) => {
    console.log("A user connected", socket.id);
    SocketService(io, socket, app);
  }
  
  io.on("connection", onConnection);
  // io.on("connect", (socket) => {
  //   console.log("A user connected", socket.id);
  //   console.log("A user connected", socket?.email);
  //   socket.emit("hello", "world", (response) => {
  //     console.log(response); // "got it"
  //   });
  //   socket.join(socket?.email);
  // });

  module.export = io;
  

  const port = process.env.PORT || 4000

  server.listen(port, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready ! at PORT ${port}`)
  });
}



startServer();