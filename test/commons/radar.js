'use strict'

const lodash = require('lodash')
const isRoughlyEqual = require('is-roughly-equal')

const co = require('../co')

const testRadar = (client, profile, helpers) => (geobox, opt) => co(function* (t) {
	const vehicles = yield client.radar(geobox, opt)
	const when = opt.when || new Date()

	t.ok(Array.isArray(vehicles))
	t.ok(vehicles.length > 0)

	if (opt.results) t.ok(vehicles.length <= opt.results)

	for (let v of vehicles) {
		helpers.assertValidLine(t, v.line)

		t.ok(lodash.isNumber(v.location.longitude))
		t.ok(v.location.longitude >= geobox.west - 3, 'vehicle is too far away') // todo: longitude > 180 || < -180
		t.ok(v.location.longitude <= geobox.east + 3, 'vehicle is too far away') // todo: longitude > 180 || < -180

		t.ok(lodash.isNumber(v.location.latitude))
		t.ok(v.location.latitude >= geobox.south - 3, 'vehicle is too far away') // todo: latitude > 90 || < -90
		t.ok(v.location.latitude <= geobox.north + 3, 'vehicle is too far away') // todo: latitude > 90 || < -90

		t.ok(Array.isArray(v.nextStops))
		for (let st of v.nextStops) {
			helpers.assertValidStopover(t, st, true)

			if (st.arrival) {
				t.ok(lodash.isString(st.arrival))
				const arr = new Date(st.arrival)
				t.ok(isRoughlyEqual(14*helpers.hour, +when, +arr)) // note that this can be an ICE train
			}

			if (st.departure) {
				t.ok(lodash.isString(st.departure))
				const dep = new Date(st.departure)
				t.ok(isRoughlyEqual(14*helpers.hour, +when, +dep)) // note that this can be an ICE train
			}
		}

		t.ok(Array.isArray(v.frames))
		for (let f of v.frames) {
			// see #28
			// todo: check if this works by now
			helpers.assertValidStation(t, f.origin, true)
			helpers.assertValidProducts(t, f.origin.products)
			helpers.assertValidStation(t, f.destination, true)
			helpers.assertValidProducts(t, f.destination.products)
			t.ok(lodash.isNumber(f.t))
		}
	}

	return t.end()
})

module.exports = testRadar
