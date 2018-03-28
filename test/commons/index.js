'use strict'

const locations = require('./locations')

const defaultHelpers = {}

module.exports = (client, profile, helpers) => {
	helpers = Object.assign({}, defaultHelpers, helpers)
	return ({
		locations: locations(client, profile, helpers)
	})
}
