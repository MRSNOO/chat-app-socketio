//everything involve in users
const users = []

const addUser = ({id, name, room}) =>{
  // nếu user enter JavaScript Mastery -> convert thành javascriptmastery
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()

  const existingUser = users.find((user) => user.room === room && user.name === name)
  if(existingUser){
    return {error: "username is taken"}
  }

  const user = {id: id, name:name, room: room}
  users.push(user)
  return {user}
}

const removeUser = (id) =>{
  const index = users.findIndex((user) => user.id === id)
  if(index !== -1){
    return users.splice(index, 1)[0] //xóa + return removed user
  }
}

const getUser = (id) => { 
  const user = users.find((user) => user.id === id)
  return user
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room)
module.exports = {addUser, removeUser, getUser, getUsersInRoom}
