const sequelize = require('../utils/database')

const ComplexCategory = sequelize.define('complex_category', {}, { timestamps: false })

module.exports = ComplexCategory
