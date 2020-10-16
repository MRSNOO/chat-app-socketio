const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const router = require("./router")

const {addUser, removeUser, getUser, getUsersInRoom} = require("./users")

const PORT = process.env.PORT || 5000 

const app = express()
const server = http.createServer(app)
const io = socketio(server)
//io là 1 máy chủ gồm nhiều socket, socket là 1 người 
io.on("connection", (socket)=>{
  console.log("We have a new connection !!!") //log in console
  
  socket.on('join', ({name, room}, callback) =>{
    //callback làm 1 cgi đó ngay sau khi emit join trong client                                                    
    const {error, user} = addUser({id: socket.id, name, room})
    
    if(error) return callback(error) // error handling
    
    // 1 user mới join
    // emit 1 event ra front end 
    socket.emit("message", {user: "admin", text: `${user.name}, welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit("message", {user:"admin", text:`${user.name} has joined`})

    socket.join(user.room)

    //see what users in the room
    io.to(user.room).emit("roomData",{room: user.room, users: getUsersInRoom(user.room)})

    callback() // ko run do ko có errors
  })

  //waiting sendMessage event in front end
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id) //specific socket instance cho mỗi ng
    
    io.to(user.room).emit("message", {user: user.name, text: message})
    io.to(user.room).emit("roomData", {user: user.room, users: getUsersInRoom(user.room)})
    callback() //thực hiện ở frontend 
    //
  }) 

  socket.on("disconnect", () => { //khi có 1 đứa leave 
    const user = removeUser(socket.id)
    
    if(user){
      io.to(user.room).emit("message", {user: "admin", text:`${user.name} has left`})
    }
    console.log("user had left")

  })
})
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(router)
server.listen(PORT, () => console.log(`Server has start on port ${PORT}`))
