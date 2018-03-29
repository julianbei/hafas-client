'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const co = require('./co')

const createClient = require('..')
const dbProfile = require('../p/db')
const dbClient = createClient(dbProfile)

const {assertValidLine, createWhen} = require('./util')

const helpers = {}
const when = createWhen('Europe/Berlin', 'de-DE')

const createCommonsTester = require('./commons')
const c = createCommonsTester(dbClient, dbProfile, helpers)

test('departures Berlin Jungfernheide', c.departures({
    type: 'station',
    id: '8011167',
    name: 'Berlin Jungfernheide',
    metaStation: true
}, {duration: 5, when}))

test('location Regensburg Hbf', c.location('8000309', {}, {id: '8000309'}))
test('location Regensburg Hbf', co(function* (t) {
    const location = yield dbClient.location('8000309')
    t.ok(Array.isArray(location.lines))
    if (Array.isArray(location.lines)) {
        for (let line of location.lines) assertValidLine(t, line)
    }
    t.end()
}))

test('locations named Jungfernheide', c.locations('Jungfernheide', {results: 10}, {
    type: 'station',
    id: '8011167',
    name: 'Berlin Jungfernheide',
    location: {
        longitude: 13.299424,
        latitude: 52.530408
    }
}))

test('nearby Berlin Jungfernheide', c.nearby(
    {
		type: 'location',
		latitude: 52.530273,
		longitude: 13.299433
	},
	{distance: 400, results: 2},
	[{
        type: 'station',
        id: '8011167',
        name: 'Berlin Jungfernheide',
        location: {
            longitude: 13.299424,
            latitude: 52.530408
        },
		distance: [0, 100]
	}]
))
