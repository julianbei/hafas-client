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

test('locations named Kiel', c.locations('Kiel', {results: 10}, {
    type: 'station',
    id: '8000199',
    name: 'Kiel Hbf',
    location: {
        longitude: 10.131976,
        latitude: 54.314982
    }
}))
