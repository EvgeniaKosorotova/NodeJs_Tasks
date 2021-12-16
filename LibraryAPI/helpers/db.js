const mysql = require('mysql2/promise');
const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config.json');

module.exports = db = {};

initialize();

async function initialize() {
	const { host, port, user, password, database } = config.database;
	const connection = await mysql.createConnection({ host, port, user, password });
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

	const sequelize = new Sequelize(database, user, password, {
		dialect: 'mysql'
	});

	db.Role = require('../models/role.model')(sequelize);
	db.Genre = require('../models/genre.model')(sequelize);
	db.User = require('../models/user.model')(sequelize);
	db.Book = require('../models/book.model')(sequelize);
	db.Logbook = require('../models/logbook.model')(sequelize);
	db.Penalty = require('../models/penalty.model')(sequelize);
	db.BookGenre = require('../models/bookGenre.model')(sequelize);

	db.User.associate = (db) => {
		db.User.belongsTo(db.Role, {
			foreignKey: 'roleId',
			sourceKey: 'id'
		});

		db.User.hasMany(db.Logbook, {
			foreignKey: 'userId',
			sourceKey: 'id'
		});
	}

	db.Role.associate = (db) => {
		db.Role.hasMany(db.User, {
			foreignKey: 'roleId',
			sourceKey: 'id'
		});
	}

	db.Genre.associate = (db) => {
		db.Genre.hasMany(db.BookGenre, {
			foreignKey: 'genreId',
			sourceKey: 'id'
		});
	}
	db.Book.associate = (db) => {
		db.Book.hasMany(db.BookGenre, {
			foreignKey: 'bookId',
			sourceKey: 'id'
		});

		db.Book.hasMany(db.Logbook, {
			foreignKey: 'bookId',
			sourceKey: 'id'
		});
	}

	db.BookGenre.associate = (db) => {
		db.BookGenre.belongsTo(db.Genre, {
			foreignKey: 'genreId',
			sourceKey: 'id'
		});

		db.BookGenre.belongsTo(db.Book, {
			foreignKey: 'bookId',
			sourceKey: 'id'
		});
	}

	db.Logbook.associate = (db) => {
		db.Logbook.belongsTo(db.User, {
			foreignKey: 'userId',
			sourceKey: 'id'
		});

		db.Logbook.belongsTo(db.Book, {
			foreignKey: 'bookId',
			sourceKey: 'id'
		});
	}

	db.Penalty.associate = (db) => {
		db.Penalty.belongsTo(db.Logbook, {
			foreignKey: 'logbookId',
			sourceKey: 'id'
		});
	}

	Object.keys(db).forEach(modelName => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});

	await sequelize.sync();

	setInterval(async () => {
		let logs = await db.Logbook.findAll({
			where: {
				isReturned: false,
				[Op.and]: Sequelize.where(
					Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('SECOND'), Sequelize.col('updatedAt'), Sequelize.literal('UTC_TIMESTAMP')),
					{
						[Op.gte]: config.intervalOverdueInSeconds
					}
				)
			}
		});

		for (let log of logs){
			await db.Penalty.create({ logbookId: log.id });

			Object.assign(log, { updatedAt: Sequelize.literal('UTC_TIMESTAMP()') });
			await log.save();
		}
	}, config.intervalOverdueInSeconds * 1000);

	setInterval(async () => {
		let penalties = await db.Penalty.findAll({
			include: [
				{
					model: db.Logbook
				}
			],
			group: ['logbook.userId'],
			having: {
				createdAt: Sequelize.where(
					Sequelize.fn('TIMESTAMPDIFF', Sequelize.literal('SECOND'), Sequelize.col('createdAt'), Sequelize.literal('UTC_TIMESTAMP')),
					{
						[Op.gte]: config.penaltyDurationInSeconds
					}
				)
			}
		});

		for (let penalty of penalties) {
			await penalty.destroy();
		}
	}, config.penaltyDurationInSeconds * 1000);

	if (!await db.Role.findOne({ where: { role: 'администратор' } })) {
		await db.Role.create({
			'role': 'администратор'
		});
		await db.Role.create({
			'role': 'подписчик'
		});

		let adminHash = await bcrypt.hash("admin-password", 10);
		let userHash = await bcrypt.hash("user-password", 10);

		await db.User.create({
			"firstName": "Admin",
			"lastName": "Admin",
			"username": "admin",
			"hash": adminHash,
			"roleId": 1
		});
		await db.User.create({
			"firstName": "User",
			"lastName": "User",
			"username": "user",
			"hash": userHash,
			"roleId": 2
		});

		let genres = ["Фэнтези", "Фантастика", "Детективы", "Pоманы", "Приключения", "Мистика", "Ужасы", "Разное"];

		for (let genre of genres) {
			await db.Genre.create({
				"genre": genre
			});
		}
	}
}