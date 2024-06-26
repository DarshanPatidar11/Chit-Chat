const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

dotenv.config();

// connect to database
connectDB();

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running....');
});

// Routes
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log(`Server is running on port ${PORT}`));

// Socket.io
const io = require("socket.io")(server, {
    pingTimeout: 6000000,
    cors: {
      origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined Room: " + room);
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });
  
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });
  
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        console.log(chat);
        if (!chat.users) return console.log("chat.users not defined");
  
        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;
            console.log(user._id);
            socket.in(user._id).emit("message received", newMessageReceived);
        });
        // socket.in(chat._id).emit("message received", newMessageReceived);
  
        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id);
        });
    });
});