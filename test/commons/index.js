'use strict'

const util = require('../util')

const location = require('./location')
const locations = require('./locations')
const nearby = require('./nearby')
const radar = require('./radar')

const defaultHelpers = Object.assign({}, util)

module.exports = (client, profile, helpers) => {
	helpers = Object.assign({
		assertValidProducts: util.createAssertValidProducts(profile.products)
	}, defaultHelpers, helpers)
	return ({
		location: location(client, profile, helpers),
		locations: locations(client, profile, helpers),
		nearby: nearby(client, profile, helpers),
		radar: radar(client, profile, helpers)
	})
}
