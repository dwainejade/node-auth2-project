require("dotenv/config")
const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.Port || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use(usersRouter)
server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})
server.listen(port, () =>{
    console.log(`Coming to ya from http://localhost:${port}`)
})
