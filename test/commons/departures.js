'use strict'

const lodash = require('lodash')
const isRoughlyEqual = require('is-roughly-equal')

const co = require('../co')

const isSameStation = (l, w) => {
	if (w.type && l.type !== w.type) return false
	if (w.metaStation) return true // station has departures for nearby/related stations, therefore comparing by id/name wouldn't work
	if (w.id && !(l.id === w.id || l.id === '00'+w.id)) return false // todo: more than 2 zeros
	if (w.name && l.name !== w.name) return false
	if (w.location && (
		!l.location
	||	!isRoughlyEqual(.0005, l.location.longitude, w.location.longitude)
	||	!isRoughlyEqual(.0005, l.location.latitude, w.location.latitude)
	)) return false
	return true
}

const testDepartures = (client, profile, helpers) => (station, opt) => co(function* (t) {
	const deps = yield client.departures(station.id, opt)
	const depsUsingObject = yield client.departures(station, opt)

	t.deepEqual(deps, depsUsingObject)
	t.ok(Array.isArray(deps))
	t.deepEqual(deps, lodash.sortBy(deps, d => +new Date(d.when)))

	for (let dep of deps) {
		t.ok(lodash.isString(dep.journeyId))
		t.ok(dep.journeyId)
		
		t.ok(isSameStation(dep.station, station))
		helpers.assertValidStation(t, dep.station)
		helpers.assertValidProducts(t, dep.station.products)
		helpers.assertValidWhen(t, dep.when, opt.when)
		helpers.assertValidLine(t, dep.line)
	}

	return t.end()
})

module.exports = testDepartures
