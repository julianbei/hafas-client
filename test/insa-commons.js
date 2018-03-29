'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const insaProfile = require('../p/insa')
const insaClient = createClient(insaProfile)

const {createWhen} = require('./util')

const helpers = {}
const when = createWhen('Europe/Berlin', 'de-DE')

const createCommonsTester = require('./commons')
const c = createCommonsTester(insaClient, insaProfile, helpers)

test('journeyLeg', c.journeyLeg('8010224', '8013456', {when}))

test('departures Magdeburg Hbf', c.departures({
    type: 'station',
    id: '8010224',
    name: 'Magdeburg Hbf',
    location: {
        longitude: 11.626891,
        latitude: 52.130352
    },
    metaStation: true
}, {duration: 5, when}))

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

test('radar', c.radar({
    north: 52.148364,
	west: 11.600826,
	south: 52.108486,
	east: 11.651451
}, {duration: 5 * 60, when, results: 10}))
