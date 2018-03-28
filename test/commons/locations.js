'use strict'

const isRoughlyEqual = require('is-roughly-equal')

const co = require('../co')

const locationIsWanted = (l, w) => {
	if (w.type && l.type !== w.type) return false
	if (w.id && !(l.id === w.id || l.id === '00'+w.id)) return false // todo: more than 2 zeros
	if (w.name && l.name !== w.name) return false
	if (w.location && (
		!l.location
	||	!isRoughlyEqual(l.location.longitude, w.location.longitude, .0005)
	||	!isRoughlyEqual(l.location.latitude, w.location.latitude, .0005)
	)) return false
	return true
}

const testLocations = (client, profile, helpers) => (query, opt, wanted) => co(function* (t) {
	const locations = yield client.locations(query, opt)

	t.ok(Array.isArray(locations))
	t.ok(locations.length > 0)

	if (opt.results) t.ok(locations.length <= opt.results)

	for (let l of locations) {
		if (l.type === 'station') helpers.assertValidStation(t, l)
		else helpers.assertValidLocation(t, l)
	}

	t.ok(locations.some(l => locationIsWanted(l, wanted)))

	return t.end()
})

module.exports = testLocations
