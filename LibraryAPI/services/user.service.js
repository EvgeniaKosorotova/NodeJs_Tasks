const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');

module.exports = {
	authenticate,
	getAll,
	getById,
	create,
	delete: _delete
};

async function authenticate({ firstName, lastName, password }) {
	let user = await db.User.scope('withHash').findOne({ where: { firstName: firstName, lastName: lastName } });

	if (!user || !(await bcrypt.compare(password, user.hash))) {
		throw new Error('First name, last name or password is incorrect');
	}

	let token = jwt.sign({ userId: user.id }, config.secret, { expiresIn: '1d' });

	return { ...omitHash(user.get()), token };
}

async function getAll() {
	return db.User.findAll();
}

async function getById(id) {
	return getUser(id);
}

async function create(params) {
	if (await db.User.findOne({ where: { firstName: params.firstName, lastName: params.lastName } })) {
		throw new Error('Name "' + params.firstName + '" "' + params.lastName + '"is already taken');
	}

	if (params.password) {
		params.hash = await bcrypt.hash(params.password, 10);
	}

	await db.User.create(params);
}

async function _delete(id) {
	let user = await getUser(id);
	await user.destroy();
}

async function getUser(id) {
	let user = await db.User.findByPk(id);

	if (!user) {
		throw new Error('User not found');
	}

	return user;
}

function omitHash(user) {
	const { hash, ...userWithoutHash } = user;
	return userWithoutHash;
}