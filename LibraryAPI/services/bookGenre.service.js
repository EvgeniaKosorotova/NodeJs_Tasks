const db = require('../helpers/db');

module.exports = {
	getAll,
	create
};

async function getAll() {
	return db.BookGenre.findAll();
}

async function create(params) {
	if (await db.BookGenre.findOne({ where: { bookId: params.bookId, genreId: params.genreId } })) {
		throw new Error('BookGenre is already taken');
	}

	return db.BookGenre.create(params);
}