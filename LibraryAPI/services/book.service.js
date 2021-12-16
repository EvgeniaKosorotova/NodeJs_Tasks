const { Sequelize, Op } = require('sequelize');
const db = require('../helpers/db');

module.exports = {
	getAll,
	getById,
	create,
	searchByAuthorOrName,
	filterByGenresAndType,
	delete: _delete
};

async function getAll() {
	return db.Book.findAll();
}

async function getById(bookId) {
	let books = await db.Book.findAll({
		include: [
			{
				model: db.BookGenre,
				include: [
					{
						model: db.Genre
					}
				]
			},
			{
				model: db.Logbook,
				required: false
			}
		],
		where: {
			id: bookId
		}
	});

	if (!books) {
		throw new Error('Book not found');
	}

	return books[0];
}

async function create(params) {
	if (await db.Book.findOne({ where: { name: params.name, author: params.author } })) {
		throw new Error('Book "' + params.name + ' ' + params.author + '" is already taken');
	}

	params.isTranslated = params.isTranslated === 'on' ? 1 : 0;
	params.isOnlyReadingRoom = params.isOnlyReadingRoom === 'on' ? 1 : 0;

	return db.Book.create(params);
}

async function searchByAuthorOrName(search) {
	return db.Book.findAll({
		where: {
			[Op.or]: [{
				author: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('author')), 'LIKE', '%' + search.toLowerCase() + '%')
			},
			{
				name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', '%' + search.toLowerCase() + '%')
			},
			{
				authorOriginal: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('authorOriginal')), 'LIKE', '%' + search.toLowerCase() + '%')
			},
			{
				nameOriginal: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('nameOriginal')), 'LIKE', '%' + search.toLowerCase() + '%')
			}
			]
		}
	});
}

async function filterByGenresAndType(genre, type, userId) {
	let genreOptions = genre == 0 ? {} : { genreId: genre };
	let logbooksOptions = {};
	if (type == 2) {
		logbooksOptions = {
			[Op.and]: Sequelize.where(Sequelize.col('logbooks.isReturned'), Op.not, null),
			[Op.and]: Sequelize.where(Sequelize.col('logbooks.userId'), Op.eq, userId),
			[Op.and]: Sequelize.where(Sequelize.col('logbooks.isReturned'), Op.eq, 0)
		};
	}
	else if (type == 1) {
		logbooksOptions = {
			[Op.or]: {
				[Op.gt]: Sequelize.where(Sequelize.col('logbooks.isReturned'), Op.eq, 1),
				[Op.gt]: Sequelize.where(Sequelize.col('logbooks.isReturned'), Op.is, null)
			}
		};
	}

	return db.Book.findAll({
		include: [
			{
				model: db.BookGenre,
				where: genreOptions
			},
			{
				model: db.Logbook,
				required: false
			}
		],
		where: logbooksOptions
	});
}

async function _delete(id) {
	let book = await db.Book.findByPk(id);

	if (!book) {
		throw new Error('Book not found');
	}

	await book.destroy();
}