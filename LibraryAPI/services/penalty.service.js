const { Sequelize } = require('sequelize');
const db = require('../helpers/db');
const logbookService = require('./logbook.service');

module.exports = {
	getByUserId,
	create,
	deleteByLogbook,
};

async function getByUserId(id) {
	return db.Penalty.findAll({
		attributes: [
			'logbookId',
			[Sequelize.fn('sum', Sequelize.col('interval')), 'total'],
		],
		include: [
			{
				attributes: ['bookId', 'userId'],
				model: db.Logbook,
				include: [{
					attributes: ['name', 'author'],
					model: db.Book,
				}]
			}
		],
		group: ['logbook.bookId'],
		having: { 'logbook.userId': id }
	});
}

async function create(params) {
	await db.Penalty.create(params);
}

async function deleteByLogbook(logbookId) {
	let penalties = await db.Penalty.findAll({
		where: {
			logbookId: logbookId
		}
	});

	for (let penalty of penalties) {
		await penalty.destroy();
	}
}