const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./utils/database')
const multer = require('multer')
// const swaggerUI = require('swagger-ui-express')
// const swaggerJsDoc = require('swagger-jsdoc')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const helmet = require('helmet')
const compression = require('compression')

const routes = require('./routes/routes')
const User = require('./models/user')
const Complex = require('./models/complex')
const ComplexFacility = require('./models/complex-facility')
const ComplexCategory = require('./models/complex-category')
const Facility = require('./models/facility')
const Comment = require('./models/comment')
const Category = require('./models/category')
const ExerciseSession = require('./models/exerciseSession')

const PORT = process.env.PORT || 3000
const LIARA_URL = process.env.LIARA_URL || 'http://localhost:' + PORT

// const options = {
// 	definition: {
// 		openapi: '3.0.0',
// 		info: {
// 			title: 'Social App API',
// 			description: 'A simple twitter-like app',
// 		},
// 		servers: [
// 			{
// 				url: `${LIARA_URL}`,
// 			},
// 		],
// 		components: {
// 			securitySchemes: {
// 				bearerAuth: {
// 					type: 'http',
// 					scheme: 'bearer',
// 					bearerFormat: 'JWT',
// 				},
// 			},
// 		},
// 		security: [
// 			{
// 				bearerAuth: [],
// 			},
// 		],
// 	},
// 	apis: ['./routes/*.js', './models/*.js'],
// }

// const specs = swaggerJsDoc(options)

const app = express()

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images')
	},
	filename: (req, file, cb) => {
		cb(null, `${uuidv4()} - ${file.originalname}`)
	},
})

const fileFilter = (req, file, cb) => {
	const isValidType =
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/avif' ||
		file.mimetype === 'image/jpeg'
	cb(null, isValidType)
}

// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs, { explorer: true }))

app.use(helmet())
app.use(compression())
app.use(bodyParser.json()) // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	next()
})

// app.get('/', (req, res) => {
// 	res.send('<a href="/api-docs" style="text-align:center;display:block">/api-docs</a>')
// })

app.use(routes)

// complex and complex owner association
User.hasMany(Complex, { onDelete: 'CASCADE', foreignKey: 'userId' })
Complex.belongsTo(User, { as: 'owner', foreignKey: 'userId' })

// exercise session associations
User.belongsToMany(Complex, {
	as: 'rented_complex',
	foreignKey: 'complexId',
	through: ExerciseSession,
})
Complex.belongsToMany(User, { as: 'renter', foreignKey: 'userId', through: ExerciseSession })
User.hasMany(ExerciseSession, { onDelete: 'CASCADE', foreignKey: 'userId' })
ExerciseSession.belongsTo(User, { as: 'renter', foreignKey: 'userId' })
Complex.hasMany(ExerciseSession, { onDelete: 'CASCADE', foreignKey: 'complexId' })
ExerciseSession.belongsTo(Complex, { as: 'rented_complex', foreignKey: 'complexId' })

// facility related associations
Complex.belongsToMany(Facility, {
	through: ComplexFacility,
	foreignKey: { name: 'complexId', allowNull: false },
})
Facility.belongsToMany(Complex, {
	through: ComplexFacility,
	foreignKey: { name: 'facilityId', allowNull: false },
})

// category related associations
Complex.belongsToMany(Category, {
	through: ComplexCategory,
	foreignKey: { name: 'complexId', allowNull: false },
})
Category.belongsToMany(Complex, {
	through: ComplexCategory,
	foreignKey: { name: 'categoryId', allowNull: false },
})

Category.belongsTo(Category, {
	foreignKey: { name: 'parentId' },
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
})

// comment related associations
Complex.hasMany(Comment, {
	onDelete: 'CASCADE',
	foreignKey: { name: 'complexId', allowNull: false },
})
Comment.belongsTo(Complex, { foreignKey: { name: 'complexId' } })

Comment.belongsTo(Comment, {
	foreignKey: { name: 'parentId' },
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
})

User.hasMany(Comment, { onDelete: 'CASCADE', foreignKey: { name: 'userId', allowNull: false } })
Comment.belongsTo(User, { foreignKey: { name: 'userId' } })

sequelize
	// .sync()
	.sync({ force: true })
	.then((result) => {
		app.listen(PORT)
	})
	.catch((err) => console.log(err))
