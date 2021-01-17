const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const { restrict } = require("./users-middleware")

const router = express.Router()

router.get("/users", restrict("Nursing"), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch (err) {
		next(err)
	}
})

router.post("/register", async (req, res, next) => {
	try {
		const { username, password, department } = req.body
		const user = await Users.findByUsername(username)

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			// hash the password with a time complexity of "12"
			password: await bcrypt.hash(password, 12),
			department
		})
		res.status(201).json(newUser)
	} catch (err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findByUsername(username)

		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({
				message: "You shall not pass!"
			})
		}

		const token = jwt.sign({
			userId: user.id,
			department: user.department,
		}, process.env.JWT_SECRET)

		res.cookie("token", token)
		res.json({
			message: `Welcome home ${user.username}!`,
		})
	} catch (err) {
		next(err)
	}
})

router.get("/logout", async (req, res, next) => {
	try {
		// this will delete the session in the database and try to expire the cookie,
		// though it's ultimately up to the client if they delete the cookie or not.
		// but it becomes useless to them once the session is deleted server-side.
		req.cookies.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router