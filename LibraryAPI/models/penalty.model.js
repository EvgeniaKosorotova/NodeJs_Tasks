const { DataTypes } = require('sequelize');
const { penaltyDurationInSeconds } = require('../config.json');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		logbookId: { type: DataTypes.INTEGER, allowNull: false },
		interval: {type: DataTypes.INTEGER, defaultValue: penaltyDurationInSeconds },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('(UTC_TIMESTAMP())')
		},
	};

	const options = {
		timestamps: false
	};

	return sequelize.define('penalties', attributes, options);
}