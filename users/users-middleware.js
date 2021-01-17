const jwt = require("jsonwebtoken")
const roles = ["basic", "admin"]

function restrict(role = "basic") {
	return async (req, res, next) => {
		const authError = {
			message: "invalid creds"
		}

		try {

			const token = req.headers.authorization
			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError)
				}
				if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
					return res.status(403).son({
						message: "role not permitted"
					})
				}
				// attached decoded payload to request to use later
				res.token = decoded

				// token has been verified
				next()
			})

		} catch (err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}