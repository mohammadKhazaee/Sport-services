'use strict'

const { v4: uuid } = require('uuid')

const facilities = require('../data/facilities')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'facilities',
			facilities.map((name) => ({
				name,
			})),
			{}
		)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('facility', null, {})
	},
}
