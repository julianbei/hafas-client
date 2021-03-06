# `locations(query, [opt])`

`query` must be an string (e.g. `'Alexanderplatz'`).

With `opt`, you can override the default options, which look like this:

```js
{
	  fuzzy:     true // find only exact matches?
	, results:   10 // how many search results?
	, stations:  true
	, addresses: true
	, poi:       true // points of interest
}
```

## Response

As an example, we're going to use the [VBB profile](../p/vbb):

```js
const createClient = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')

const client = createClient(vbbProfile)

client.locations('Alexanderplatz', {results: 3})
.then(console.log)
.catch(console.error)
```

The response may look like this:

```js
[ {
	type: 'station',
	id: '900000100003',
	name: 'S+U Alexanderplatz',
	location: {
		type: 'location',
		latitude: 52.521508,
		longitude: 13.411267
	},
	products: {
		suburban: true,
		subway: true,
		tram: true,
		bus: true,
		ferry: false,
		express: false,
		regional: true
	}
}, { // point of interest
	type: 'location',
	name: 'Berlin, Holiday Inn Centre Alexanderplatz****',
	id: '900980709',
	latitude: 52.523549,
	longitude: 13.418441
}, { // point of interest
	type: 'location',
	name: 'Berlin, Hotel Agon am Alexanderplatz',
	id: '900980176',
	latitude: 52.524556,
	longitude: 13.420266
} ]
```
