'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const nahshProfile = require('../p/nahsh')
const nahshClient = createClient(nahshProfile)

const helpers = {}

const createCommonsTester = require('./commons')
const c = createCommonsTester(nahshClient, nahshProfile, helpers)

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
