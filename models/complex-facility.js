const { Sequelize } = require('sequelize')

const sequelize = require('../utils/database')

const ComplexFacility = sequelize.define('complex_facility', {}, { timestamps: false })

module.exports = ComplexFacility
