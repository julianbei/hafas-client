'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const insaProfile = require('../p/insa')
const insaClient = createClient(insaProfile)

const helpers = {}

const createCommonsTester = require('./commons')
const c = createCommonsTester(insaClient, insaProfile, helpers)

test('location Magdeburg-Buckau', c.location('8013456', {}, {id: '8013456'}))

test('locations named Magdeburg', c.locations('Magdeburg', {results: 10}, {
    type: 'station',
    id: '8010224',
    name: 'Magdeburg Hbf',
    location: {
        longitude: 11.626891,
        latitude: 52.130352
    }
}))

test('nearby Magdeburg Hbf', c.nearby(
    {
		type: 'location',
		latitude: 52.130352,
		longitude: 11.626891
	},
	{distance: 400, results: 2},
	[{
        type: 'station',
        id: '8010224',
        name: 'Magdeburg Hbf',
        location: {
            longitude: 11.626891,
            latitude: 52.130352
        },
		distance: [0, 100]
	}]
))
