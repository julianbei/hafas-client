'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const co = require('./co')

const createClient = require('..')
const vbbProfile = require('../p/vbb')
const vbbClient = createClient(vbbProfile)

const helpers = {}

const createCommonsTester = require('./commons')
const c = createCommonsTester(vbbClient, vbbProfile, helpers)


test('locations named Alexanderplatz', c.locations('Alexanderplatz', {results: 10}, {type: 'station'}))
test('locations named Alexanderplatz', co(function* (t) {
	const locations = yield vbbClient.locations('Alexanderplatz', {results: 20})
	t.ok(locations.find(s => s.id && s.name)) // POIs
	t.ok(locations.find(s => !s.name && s.address)) // addresses
	t.end()
}))
