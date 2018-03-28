'use strict'

const isRoughlyEqual = require('is-roughly-equal')

const co = require('../co')

const locationIsWanted = (l, w) => {
	if (w.id && !(l.id === w.id || l.id === '00'+w.id)) return false // todo: more than 2 zeros
	return true
}

const testLocation = (client, profile, helpers) => (locationId, opt, wanted) => co(function* (t) {
	const location = yield client.location(locationId)

	helpers.assertValidStation(t, location)
	t.ok(locationIsWanted(location, wanted))

	return t.end()
})

module.exports = testLocation
