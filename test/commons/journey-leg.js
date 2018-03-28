'use strict'

const lodash = require('lodash')

const co = require('../co')

const locationIsWanted = (l, w) => {
	if (w.id && !(l.id === w.id || l.id === '00'+w.id)) return false // todo: more than 2 zeros
	return true
}

const testJourneyLeg = (client, profile, helpers) => (originId, destinationId, opt) => co(function* (t) {
	const when = opt.when || new Date()
	const journeys = yield client.journeys(originId, destinationId, {results: 1, when})
	const p = journeys[0].legs[0]

	t.ok(p.id, 'precondition failed')
	t.ok(p.line.id, 'precondition failed')

	const leg = yield client.journeyLeg(p.id, p.line.name, opt)

	t.ok(lodash.isString(leg.id))
	t.ok(leg.id)

	helpers.assertValidLine(t, leg.line)

	t.ok(lodash.isString(leg.direction))
	t.ok(leg.direction)

	if (opt.passedStations !== false) {
		t.ok(Array.isArray(leg.passed))
		for (let passed of leg.passed) helpers.assertValidStopover(t, passed)
	}

	return t.end()
})

module.exports = testJourneyLeg
