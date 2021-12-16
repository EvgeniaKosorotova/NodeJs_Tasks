const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
	const attributes = {
		id: { type:DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		firstName: { type: DataTypes.STRING, allowNull: false },
		lastName: { type: DataTypes.STRING, allowNull: false },
		address:{ type: DataTypes.STRING },
		hash: { type: DataTypes.STRING },
		roleId: { type: DataTypes.INTEGER, allowNull: true }
	};

	const options = {
		timestamps: false,
		defaultScope: {
			attributes: { exclude: ['hash'] }
		},
		scopes: {
			withHash: { attributes: {}, }
		}
	};

	return sequelize.define('users', attributes, options);
}