const { DataTypes } = require('sequelize');
const { usageTimeInSeconds } = require('../config.json');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		userId: { type: DataTypes.INTEGER, allowNull: false },
		bookId: { type: DataTypes.INTEGER, allowNull: false },
		isHome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		isReturned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('(UTC_TIMESTAMP())')
		},
		updatedAt: {
			type: DataTypes.DATE, 
			allowNull: false, 
			defaultValue: sequelize.literal(`(TIMESTAMPADD(SECOND, ${usageTimeInSeconds}, UTC_TIMESTAMP()))`)
		},
	};

	const options = {
		timestamps: false
	};

	return sequelize.define('logbooks', attributes, options);
}