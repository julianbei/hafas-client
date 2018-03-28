'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const oebbProfile = require('../p/oebb')
const oebbClient = createClient(oebbProfile)

const {createWhen, createAssertValidProducts} = require('./util')

const _assertValidProducts = createAssertValidProducts(oebbProfile.products)
// some stations don't have products :/
// todo: create upstream issue
const assertValidProducts = (t, p) => !p || _assertValidProducts(t, p)

const helpers = {assertValidProducts}
const when = createWhen('Europe/Vienna', 'de-AT')

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

test('radar Salzburg', c.radar({
    north: 47.827203,
    west: 13.001261,
    south: 47.773278,
    east: 13.07562
}, {duration: 5 * 60, when}))
