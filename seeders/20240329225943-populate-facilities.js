'use strict'

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
		await queryInterface.bulkDelete('facilities', null, {})
		await queryInterface.sequelize.query('ALTER TABLE facilities AUTO_INCREMENT = 1;')
	},
}
