const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		author: { type: DataTypes.STRING, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: false },
		annotation: { type: DataTypes.STRING(500), allowNull: false },
		isTranslated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		authorOriginal: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
		nameOriginal: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
		isOnlyReadingRoom: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
	};

	const options = {
		timestamps: false
	};

	return sequelize.define('books', attributes, options);
}