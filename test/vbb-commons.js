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
	assertValidLine: _assertValidLine
} = require('./util')
const shorten = require('vbb-short-station-name')

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
