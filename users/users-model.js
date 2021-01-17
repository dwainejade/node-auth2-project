const db = require("../database/config")

async function add(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}

function find() {
	return db("users as u")
		.select("u.id", "u.username", "u.password", "u.department")
}

function findById(id) {
	return db("users as u")
		.where("u.id", id)
		.first("u.id", "u.username", "u.password", "u.department")
}

function findByUsername(username) {
	return db("users as u")
		.where("u.username", username)
		.first("u.id", "u.username", "u.password", "u.department")
}

module.exports = {
	add,
	find,
	findById,
	findByUsername,
}