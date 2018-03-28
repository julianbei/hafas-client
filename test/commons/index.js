'use strict'

const util = require('../util')

const locations = require('./locations')

const defaultHelpers = Object.assign({}, util)

module.exports = (client, profile, helpers) => {
	helpers = Object.assign({}, defaultHelpers, helpers)
	return ({
		locations: locations(client, profile, helpers)
	})
}
