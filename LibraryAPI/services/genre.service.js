const db = require('../helpers/db');

module.exports = {
	getAll
};

async function getAll() {
	return db.Genre.findAll();
}