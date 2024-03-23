const express = require('express')

const authController = require('../controllers/auth')
const validator = require('../middlewares/validation')

const Router = express.Router()

/**
 * @swagger
 * /auth/signup:
 *   put:
 *     tags: [Auths]
 *     summary: Returns signing up in the app
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testp@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: John kambizi
 *     responses:
 *       201:
 *         description: the list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: 'User created!'
 *                 userId:
 *                   type: string
 *                   default: 64ca914ee2a33844942621b3
 *       422:
 *         description: happens when user enters wrong input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Validation failed.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         example: body
 *                       param:
 *                         type: string
 *                         example: password
 *                       value:
 *                         type: string
 *                         example: 123fr4
 *                       msg:
 *                         type: string
 *                         example: Invalid value
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// PUT /auth/signup
Router.put('/signup', validator.putSignup, authController.putSignup)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auths]
 *     summary: Logs in the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: m.khazaee.p@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: returns web token and user's id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   default: jwt - long hashed string
 *                 userId:
 *                   type: string
 *                   default: 64ca914ee2a33844942621b3
 *       401:
 *         description: happens when user enters wrong input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   default: Wrong password!
 *       500:
 *         description: server failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 */

// POST /auth/login
Router.post('/login', validator.postLogin, authController.postLogin)

// PUT /auth/verify-number
Router.put('/verify-number', validator.putVerifyNumber, authController.putVerifyNumber)

// POST /auth/verify-number
Router.post('/verify-number', validator.postVerifyNumber, authController.postVerifyNumber)

// POST /auth/check-email
Router.post('/check-email', validator.postCheckEmail, authController.postCheckEmail)

module.exports = Router
