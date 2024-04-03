const fs = require('fs')
const path = require('path')

const { parse } = require('csv-parse')

module.exports = async (filename) => {
	const records = []
	const parser = fs
		.createReadStream(path.join(__dirname, '..', 'data', filename + '.csv'))
		.pipe(parse())
	for await (const record of parser) records.push(record)
	return records
}
