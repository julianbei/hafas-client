'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const nahshProfile = require('../p/nahsh')
const nahshClient = createClient(nahshProfile)

const {createWhen} = require('./util')

const helpers = {}
const when = createWhen('Europe/Berlin', 'de-DE')

const createCommonsTester = require('./commons')
const c = createCommonsTester(nahshClient, nahshProfile, helpers)

// todo: investigate why flensburg -> husum (8000181) doesn't work
test('journeyLeg', c.journeyLeg('8000103', '8005362', {when}))

test('location Schleswig', c.location('8005362', {}, {id: '8005362'}))

test('locations named Kiel', c.locations('Kiel', {results: 10}, {
    type: 'station',
    id: '8000199',
    name: 'Kiel Hbf',
    location: {
        longitude: 10.131976,
        latitude: 54.314982
    }
}))

test('nearby Kiel Hbf', c.nearby(
    {
		type: 'location',
		latitude: 54.314982,
		longitude: 10.131976
	},
	{distance: 400, results: 2},
	[{
        type: 'station',
        id: '8000199',
        name: 'Kiel Hbf',
        location: {
            longitude: 10.131976,
            latitude: 54.314982
        },
		distance: [0, 100]
	}]
))

// todo: see #34
test.skip('radar Kiel', c.radar({
    north: 54.4,
    west: 10.0,
    south: 54.2,
    east: 10.2,
}, {duration: 5 * 60, when}))
