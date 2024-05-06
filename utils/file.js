const fs = require('fs')
const path = require('path')

exports.deleteFile = (filePath) => {
	let systemPath = filePath
	if (process.platform === 'win32') systemPath = filePath.replace('/', '\\')

	systemPath = path.join(__dirname, '..', systemPath)

	return new Promise((res, rej) => {
		fs.unlink(systemPath, (err) => {
			if (err) rej(err)
			res(true)
		})
	})
}
