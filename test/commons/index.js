'use strict'

// todo: additional validation using validate-fptf

const util = require('../util')

const journeyLeg = require('./journey-leg')
const departures = require('./departures')
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
		journeyLeg: journeyLeg(client, profile, helpers),
		departures: departures(client, profile, helpers),
		location: location(client, profile, helpers),
		locations: locations(client, profile, helpers),
		nearby: nearby(client, profile, helpers),
		radar: radar(client, profile, helpers)
	})
}
