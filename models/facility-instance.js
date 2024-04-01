const Sequelize = require('sequelize')

const sequelize = require('../utils/database')

const FacilityInstance = sequelize.define('facility_instance', {}, { timestamps: false })

module.exports = FacilityInstance
