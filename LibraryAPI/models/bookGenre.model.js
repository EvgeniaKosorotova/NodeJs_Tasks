const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		bookId: { type: DataTypes.INTEGER },
    genreId: { type: DataTypes.INTEGER },
	};

	const options = {
		timestamps: false
	};

	return sequelize.define('bookgenres', attributes, options);
}