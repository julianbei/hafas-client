'use strict'

const tapePromise = require('tape-promise').default
const tape = require('tape')
const test = tapePromise(tape)

const createClient = require('..')
const dbProfile = require('../p/db')
const dbClient = createClient(dbProfile)

const helpers = {}

const createCommonsTester = require('./commons')
const c = createCommonsTester(dbClient, dbProfile, helpers)


test('locations named Jungfernheide', c.locations('Jungfernheide', {results: 10}, {
    type: 'station',
    id: '8011167',
    name: 'Berlin Jungfernheide',
    location: {
        longitude: 13.299424,
        latitude: 52.530408
    }
}))
