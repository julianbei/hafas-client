'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const isRoughlyEqual = require('is-roughly-equal')
const validateFptf = require('validate-fptf')

const co = require('./co')
const createClient = require('..')
const insaProfile = require('../p/insa')
const allProducts = require('../p/insa/products')
const {
	assertValidStation,
	assertValidPoi,
	assertValidAddress,
	assertValidLocation,
	assertValidLine,
	assertValidStopover,
	hour,
	createWhen,
	assertValidWhen
} = require('./util.js')

const when = createWhen('Europe/Berlin', 'de-DE')

const assertValidStationProducts = (t, p) => {
	t.ok(p)
	t.equal(typeof p.nationalExp, 'boolean')
	t.equal(typeof p.national, 'boolean')
	t.equal(typeof p.regional, 'boolean')
	t.equal(typeof p.suburban, 'boolean')
	t.equal(typeof p.tram, 'boolean')
	t.equal(typeof p.bus, 'boolean')
	t.equal(typeof p.tourismTrain, 'boolean')
}

const isMagdeburgHbf = s => {
	return (
		s.type === 'station' &&
		(s.id === '8010224' || s.id === '008010224') &&
		s.name === 'Magdeburg Hbf' &&
		s.location &&
		isRoughlyEqual(s.location.latitude, 52.130352, 0.001) &&
		isRoughlyEqual(s.location.longitude, 11.626891, 0.001)
	)
}

const assertIsMagdeburgHbf = (t, s) => {
	t.equal(s.type, 'station')
	t.ok(s.id === '8010224' || s.id === '008010224', 'id should be 8010224')
	t.equal(s.name, 'Magdeburg Hbf')
	t.ok(s.location)
	t.ok(isRoughlyEqual(s.location.latitude, 52.130352, 0.001))
	t.ok(isRoughlyEqual(s.location.longitude, 11.626891, 0.001))
}

// todo: DRY with assertValidStationProducts
// todo: DRY with other tests
const assertValidProducts = (t, p) => {
	for (let product of allProducts) {
		product = product.id
		t.equal(typeof p[product], 'boolean', 'product ' + p + ' must be a boolean')
	}
}

const test = tapePromise(tape)
const client = createClient(insaProfile)

test('Magdeburg Hbf to Magdeburg-Buckau', co(function*(t) {
	const magdeburgHbf = '8010224'
	const magdeburgBuckau = '8013456'
	const journeys = yield client.journeys(magdeburgHbf, magdeburgBuckau, {
		when,
		passedStations: true
	})

	t.ok(Array.isArray(journeys))
	t.ok(journeys.length > 0, 'no journeys')
	for (let journey of journeys) {
		t.ok(Array.isArray(journey.legs))
		t.ok(journey.legs.length > 0, 'no legs')
		const leg = journey.legs[0] // todo: all legs

		assertValidStation(t, leg.origin)
		assertValidStationProducts(t, leg.origin.products)
		assertValidWhen(t, leg.departure, when)
		t.equal(typeof leg.departurePlatform, 'string')

		assertValidStation(t, leg.destination)
		assertValidStationProducts(t, leg.origin.products)
		assertValidWhen(t, leg.arrival, when)
		t.equal(typeof leg.arrivalPlatform, 'string')

		assertValidLine(t, leg.line)

		t.ok(Array.isArray(leg.passed))
		for (let stopover of leg.passed) assertValidStopover(t, stopover)
	}

	t.end()
}))

test('Magdeburg Hbf to 39104 Magdeburg, Sternstr. 10', co(function*(t) {
	const magdeburgHbf = '8010224'
	const sternStr = {
		type: 'location',
		latitude: 52.118414,
		longitude: 11.422332,
		address: 'Magdeburg - Altenstadt, Sternstraße 10'
	}

	const journeys = yield client.journeys(magdeburgHbf, sternStr, {
		when
	})

	t.ok(Array.isArray(journeys))
	t.ok(journeys.length >= 1, 'no journeys')
	const journey = journeys[0]
	const firstLeg = journey.legs[0]
	const lastLeg = journey.legs[journey.legs.length - 1]

	assertValidStation(t, firstLeg.origin)
	assertValidStationProducts(t, firstLeg.origin.products)
	if (firstLeg.origin.products)
		assertValidProducts(t, firstLeg.origin.products)
	assertValidWhen(t, firstLeg.departure, when)
	assertValidWhen(t, firstLeg.arrival, when)
	assertValidWhen(t, lastLeg.departure, when)
	assertValidWhen(t, lastLeg.arrival, when)

	const d = lastLeg.destination
	assertValidAddress(t, d)
	t.equal(d.address, 'Magdeburg - Altenstadt, Sternstraße 10')
	t.ok(isRoughlyEqual(0.0001, d.latitude, 52.118414))
	t.ok(isRoughlyEqual(0.0001, d.longitude, 11.422332))

	t.end()
}))

test('Kloster Unser Lieben Frauen to Magdeburg Hbf', co(function*(t) {
	const kloster = {
		type: 'location',
		latitude: 52.127601,
		longitude: 11.636437,
		name: 'Magdeburg, Kloster Unser Lieben Frauen (Denkmal)',
		id: '970012223'
	}
	const magdeburgHbf = '8010224'
	const journeys = yield client.journeys(kloster, magdeburgHbf, {
		when
	})

	t.ok(Array.isArray(journeys))
	t.ok(journeys.length >= 1, 'no journeys')
	const journey = journeys[0]
	const firstLeg = journey.legs[0]
	const lastLeg = journey.legs[journey.legs.length - 1]

	const o = firstLeg.origin
	assertValidPoi(t, o)
	t.equal(o.name, 'Magdeburg, Kloster Unser Lieben Frauen (Denkmal)')
	t.ok(isRoughlyEqual(0.0001, o.latitude, 52.127601))
	t.ok(isRoughlyEqual(0.0001, o.longitude, 11.636437))

	assertValidWhen(t, firstLeg.departure, when)
	assertValidWhen(t, firstLeg.arrival, when)
	assertValidWhen(t, lastLeg.departure, when)
	assertValidWhen(t, lastLeg.arrival, when)

	assertValidStation(t, lastLeg.destination)
	assertValidStationProducts(t, lastLeg.destination.products)
	if (lastLeg.destination.products)
		assertValidProducts(t, lastLeg.destination.products)

	t.end()
}))

test('journeys: via works – with detour', co(function* (t) {
	// Going from Magdeburg, Hasselbachplatz (Sternstr.) (Tram/Bus) to Stendal via Dessau without detour
	// is currently impossible. We check if the routing engine computes a detour.
	const hasselbachplatzSternstrasse = '000006545'
	const stendal = '008010334'
	const dessau = '008010077'
	const dessauPassed = '8010077'
	const [journey] = yield client.journeys(hasselbachplatzSternstrasse, stendal, {
		via: dessau,
		results: 1,
		when,
		passedStations: true
	})

	t.ok(journey)

	const l = journey.legs.some(l => l.passed && l.passed.some(p => p.station.id === dessauPassed))
	t.ok(l, 'Dessau is not being passed')

	t.end()
}))

test('journeys: via works – without detour', co(function* (t) {
	// When going from Magdeburg, Hasselbachplatz (Sternstr.) (Tram/Bus) to Magdeburg, Universität via Magdeburg, Breiter Weg, there is *no need*
	// to change trains / no need for a "detour".
	const hasselbachplatzSternstrasse = '000006545'
	const universitaet = '000019686'
	const breiterWeg = '000013519'
	const breiterWegPassed = '13519'

	const [journey] = yield client.journeys(hasselbachplatzSternstrasse, universitaet, {
		via: breiterWeg,
		results: 1,
		when,
		passedStations: true
	})

	t.ok(journey)

	const l = journey.legs.some(l => l.passed && l.passed.some(p => p.station.id === breiterWegPassed))
	t.ok(l, 'Magdeburg, Breiter Weg is not being passed')

	t.end()
}))
