const db = require('../helpers/db');

module.exports = {
	getById,
	getByUserAndBook,
	create,
	update
};

async function getById(id) {
	let logbook = await db.Logbook.findOne({ where: { id: id } });

	if (!logbook) {
		throw new Error('Logbook not found');
	}

	return logbook;
}

async function getByUserAndBook(userId, bookId) {
	let logbook = await db.Logbook.findOne({
		where: {
			userId: userId,
			bookId: bookId
		},
		order: [[ 'createdAt', 'DESC' ]],
	});

	if (!logbook) {
		throw new Error('Logbook not found');
	}

	return logbook;
}

async function create(params) {
	await db.Logbook.create(params);
}

async function update(params) {
	let logbook = await db.Logbook.findOne({
		where: { 
			userId: params.userId, 
			bookId: params.bookId, 
			isReturned: 0
		}
	});

	Object.assign(logbook, params);
	await logbook.save();

	return logbook.get();
}