const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		genre: { type: DataTypes.STRING, allowNull: false }
	};

	const options = {
		timestamps: false
	};

	return sequelize.define('genres', attributes, options);
}