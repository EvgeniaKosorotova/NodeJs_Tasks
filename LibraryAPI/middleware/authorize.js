const jwt = require('jsonwebtoken');
const { secret } = require('../config.json');
const db = require('../helpers/db');

module.exports = authorize;

function authorize(req, res, next) {
	let authcookie = req.cookies.access_token;

	jwt.verify(authcookie, secret, async (err, data) => {
		if (err) {
			res.redirect('/login');
		}
		else if (data.userId) {
			let user = await db.User.findByPk(data.userId);
			let isAdmin = (await db.Role.findByPk(user.roleId)).role == "администратор";

			if (!user) {
				res.redirect('/login');

				return res.status(401).json({ message: 'Unauthorized' });
			}

			req.isAdmin = isAdmin;
			req.user = user.get();
			next();
		}
	});
}