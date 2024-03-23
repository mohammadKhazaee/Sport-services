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
const { check } = require('express-validator')

const routes = require('./routes/routes')

const PORT = process.env.PORT || 8080
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

sequelize
	.sync()
	// .sync({ force: true })
	.then((result) => {
		app.listen(PORT)
	})
	.catch((err) => console.log(err))
