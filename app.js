const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./utils/database')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')

const routes = require('./routes/routes')

const PORT = process.env.PORT || 3000
const LIARA_URL = process.env.LIARA_URL || 'http://localhost:' + PORT

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

app.use(helmet())
app.use(morgan('combined'))
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

app.use(routes)

sequelize
	.sync()
	// .sync({ force: true })
	.then((result) => {
		app.listen(PORT)
	})
	.catch((err) => console.log(err))
