import { Server } from "socket.io";

const io = new Server("https://socket-mauve.vercel.app", {
  cors: {
    origin: "https://whatsapp-frontend-kohl.vercel.app",
  },
});

let users = [];

const addUser = (userData, socketId) => {
  if (!users.some((user) => user.sub == userData.sub)) {
    users.push({ ...userData, socketId });
  }
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    console.log(data, users, "userrr");
    io.to(user?.socketId).emit("getMessage", data);
  });
});
