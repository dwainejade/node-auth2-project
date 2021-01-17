const jwt = require("jsonwebtoken")
const departments = ["Nursing", "Business"]

function restrict(department) {
	return async (req, res, next) => {
		const authError = {
			message: "invalid creds"
		}

		try {
			const token = req.cookies.token
			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError)
				}
				if (department && decoded.department !== "Nursing") {
					return res.status(403).json({
						message: "department shall not pass!"
					})
				}
				// attached decoded payload to request to use later
				res.token = decoded
				console.log(decoded)

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