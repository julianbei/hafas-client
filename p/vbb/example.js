'use strict'

const createClient = require('../..')
const vbbProfile = require('.')

const client = createClient(vbbProfile)

// U Kottbusser Tor -> U Platz der Luftbrücke
client.journeys('900000013102', '900000017102', {
	results: 1,
	passedStations: true,
	transferInfo: true
})
// client.departures('900000013102', {duration: 1})
// client.locations('Alexanderplatz', {results: 2})
// client.location('900000042101') // Spichernstr
// client.nearby(52.5137344, 13.4744798, {distance: 60})
// client.radar(52.52411, 13.41002, 52.51942, 13.41709, {results: 10})

.then((data) => {
	console.log(require('util').inspect(data, {depth: null}))
})
.catch(console.error)
