'use strict'

const util = require('../util')

const location = require('./location')
const locations = require('./locations')

const defaultHelpers = Object.assign({}, util)

module.exports = (client, profile, helpers) => {
	helpers = Object.assign({}, defaultHelpers, helpers)
	return ({
		location: location(client, profile, helpers),
		locations: locations(client, profile, helpers)
	})
}
