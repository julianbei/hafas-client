'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const co = require('./co')

const createClient = require('..')
const vbbProfile = require('../p/vbb')
const vbbClient = createClient(vbbProfile)

const {
	assertValidStation: _assertValidStation,
	assertValidLine: _assertValidLine,
	createWhen
} = require('./util')
const shorten = require('vbb-short-station-name')
const stations = require('vbb-stations-autocomplete')

const findStation = (query) => stations(query, true, false)[0]
const assertValidStation = (t, s, coordsOptional = false) => {
	_assertValidStation(t, s, coordsOptional)
	t.equal(s.name, shorten(s.name))
}
const assertValidLine = (t, l) => {
	_assertValidLine(t, l)
	if (l.symbol !== null) t.equal(typeof l.symbol, 'string')
	if (l.nr !== null) t.equal(typeof l.nr, 'number')
	if (l.metro !== null) t.equal(typeof l.metro, 'boolean')
	if (l.express !== null) t.equal(typeof l.express, 'boolean')
	if (l.night !== null) t.equal(typeof l.night, 'boolean')
}

const helpers = {assertValidStation, assertValidLine}
const when = createWhen('Europe/Berlin', 'de-DE')

const createCommonsTester = require('./commons')
const c = createCommonsTester(vbbClient, vbbProfile, helpers)

test('location Spichernstr', c.location('900000042101', {}, {id: '900000042101'}))
test('location Spichernstr', co(function* (t) {
	const location = yield vbbClient.location('900000042101')
	t.ok(Array.isArray(location.lines))
	if (Array.isArray(location.lines)) {
		for (let line of location.lines) assertValidLine(t, line)
	}
	t.end()
}))

test('locations named Alexanderplatz', c.locations('Alexanderplatz', {results: 10}, {type: 'station'}))
test('locations named Alexanderplatz', co(function* (t) {
	const locations = yield vbbClient.locations('Alexanderplatz', {results: 20})
	t.ok(locations.find(s => s.id && s.name)) // POIs
	t.ok(locations.find(s => !s.name && s.address)) // addresses
	t.end()
}))

test('nearby Berliner Str./Bundesallee', c.nearby(
	{
		type: 'location',
		latitude: 52.4873452,
		longitude: 13.3310411
	},
	{distance: 200},
	[
		{
			id: '900000044201',
			name: 'U Berliner Str.',
			distance: [0, 100]
		},
		{
			id: '900000043252',
			name: 'Landhausstr.',
			distance: [100, 200]
		}
	]
))

const geoBox = {
	north: 52.52411,
	west: 13.41002,
	south: 52.51942,
	east: 13.41709
}

test('radar', c.radar(geoBox, {duration: 5 * 60, when}))
test('radar', co(function* (t) {
	const vehicles = yield vbbClient.radar(geoBox, {duration: 5 * 60, when})
	for (let v of vehicles) {
		if (!findStation(v.direction)) {
			const err = new Error('unknown direction: ' + v.direction)
			err.stack = err.stack.split('\n').slice(0, 2).join('\n')
			console.error(err)
		}

		for (let st of v.nextStops) t.strictEqual(st.station.name.indexOf('(Berlin)'), -1)

		for (let f of v.frames) {
			t.strictEqual(f.origin.name.indexOf('(Berlin)'), -1)
			t.strictEqual(f.destination.name.indexOf('(Berlin)'), -1)
		}
	}
	t.end()
}))
