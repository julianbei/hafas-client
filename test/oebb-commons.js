'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const oebbProfile = require('../p/oebb')
const oebbClient = createClient(oebbProfile)

const helpers = {}

const createCommonsTester = require('./commons')
const c = createCommonsTester(oebbClient, oebbProfile, helpers)

test('location Graz Hbf', c.location('8100173', {}, {id: '8100173'}))

test('locations named Salzburg', c.locations('Salzburg', {results: 10}, {
    type: 'station',
    id: '8100002',
    name: 'Salzburg Hbf',
    location: {
        longitude: 13.045604,
        latitude: 47.812851
    }
}))

test('nearby Salzburg Hbf', c.nearby(
    {
		type: 'location',
		longitude: 13.045604,
		latitude: 47.812851
	},
	{distance: 400, results: 2},
	[{
        type: 'station',
        id: '8100002',
        name: 'Salzburg Hbf',
        location: {
            longitude: 13.045604,
            latitude: 47.812851
        },
		distance: [0, 100]
	}]
))
