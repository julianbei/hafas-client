'use strict'

const isRoughlyEqual = require('is-roughly-equal')

const co = require('../co')

const locationIsWanted = (l, w) => {
	if (w.type && l.type !== w.type) return false
	if (w.id && !(l.id === w.id || l.id === '00'+w.id)) return false // todo: more than 2 zeros
	if (w.name && l.name !== w.name) return false
	if (w.location && (
		!l.location
	||	!isRoughlyEqual(.0005, l.location.longitude, w.location.longitude)
	||	!isRoughlyEqual(.0005, l.location.latitude, w.location.latitude)
	)) return false
	if (w.distance && !(l.distance >= w.distance[0])) return false
	if (w.distance && !(l.distance <= w.distance[1])) return false
	return true
}

const testNearby = (client, profile, helpers) => (location, opt, wantedInOrder) => co(function* (t) {
	const nearby = yield client.nearby(location, opt)

	t.ok(Array.isArray(nearby))
	for (let n of nearby) {
		if (n.type === 'station') helpers.assertValidStation(t, n)
		else helpers.assertValidLocation(t, n, false)
	}

	if (opt.results) t.ok(nearby.length <= opt.results)
	if (opt.distance) t.ok(nearby.every(n => n.distance <= opt.distance))

	t.ok(nearby.length >= wantedInOrder.length)
	if (nearby.length >= wantedInOrder.length) {
		for (let i = 0; i < wantedInOrder.length; i++) t.ok(locationIsWanted(nearby[i], wantedInOrder[i]))
	}

	return t.end()
})

module.exports = testNearby
