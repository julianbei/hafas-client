'use strict'

const throttle = require('p-throttle')

const request = require('./lib/request')
const createClient = require('.')

const createThrottledClient = (profile, limit = 5, interval = 1000) => {
	const throttledRequest = throttle(request, limit, interval)
	return createClient(profile, throttledRequest)
}

module.exports = createThrottledClient
