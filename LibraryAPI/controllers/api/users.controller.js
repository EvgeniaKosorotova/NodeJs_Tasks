const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authorize = require('../../middleware/authorize');
const userService = require('../../services/user.service');

router.post('/authenticate', authenticateSchema(), authenticate);
router.post('/register', authorize, registerSchema(), register);
router.get('/', authorize, getAll);
router.get('/:id/penalties', authorize, getPenaltiesById);
router.get('/logout', authorize, logout);
router.delete('/:id', authorize, _delete);

module.exports = router;

function authenticateSchema() {
	return [
		check('firstName', 'Имя должно быть длиной 3+ символов.')
			.notEmpty()
			.isLength({ min: 3 }),
		check('lastName', 'Фамилия должна быть длиной 3+ символов.')
			.notEmpty()
			.isLength({ min: 3 }),
		check("password", "Пароль должен быть длиной 6-15 символов.")
			.notEmpty()
			.isLength({ min: 6, max: 15 })
	]
}

function authenticate(req, res, next) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		let alert = errors.array();
		req.flash('alert', alert);
		req.flash('input', {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
		});
		res.redirect("/login");
	}
	else {
		userService.authenticate(req.body)
			.then((user) => res.cookie("access_token", user.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			}))
			.then(() => res.redirect("/"))
			.catch(next);
	}
}

function registerSchema() {
	return [
		check('firstName', 'Имя должно быть длиной 3+ символов.')
			.notEmpty()
			.isLength({ min: 3 }),
		check('lastName', 'Фамилия должна быть длиной 3+ символов.')
			.notEmpty()
			.isLength({ min: 3 }),
		check("password", "Пароль должен быть длиной 6-15 символов.")
			.notEmpty()
			.isLength({ min: 6, max: 15 })
			.custom((value, { req }) => {
				return value === req.body.confirmPassword;
			})
			.withMessage("Пароли не совпадают.")
	]
}

async function register(req, res, next) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		let alert = errors.array();
		req.flash('alert', alert);
		req.flash('input', {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			address: req.body.address,
			roleId: req.body.roleId,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword
		});
		
		res.redirect("/");
	}
	else {
		userService.create(req.body)
			.then(() => res.redirect("/"))
			.catch(next);
	}
}

function logout(req, res) {
	res.clearCookie("access_token");

	return res.redirect("/login");
}

function getAll(req, res, next) {
	userService.getAll()
		.then(users => res.json(users))
		.catch(next);
}

function getPenaltiesById(req, res, next) {
	penaltyService.getByUserId(req.params.id)
		.then(() => res.json(penalty))
		.catch(next);
}

function _delete(req, res, next) {
	userService.delete(req.params.id)
		.then(() => res.redirect("/"))
		.catch(next);
}