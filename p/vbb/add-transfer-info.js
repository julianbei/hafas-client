'use strict'

const getChangePositions = require('vbb-change-positions')

// by prevStation-fromStation-toStation-nextStation signature
const changePositions = {}

const importTask = getChangePositions()
.then((data) => {
	for (let item of data) {
		const sig = [
			item.previousStation.id,
			item.fromStation.id,
			item.toStation.id,
			item.nextStation.id
		].join('-')

		if (!Array.isArray(changePositions[sig])) changePositions[sig] = []
		// todo: store in a more compact form
		// [fromLines, fromPosition, toLines, toPosition, samePlatform]
		changePositions[sig].push(item)
	}
})
importTask.catch(console.error)

// Synchronous iteration might become a problem in the future, as
// `vbb-change-positions` might contain thousands of entries.
// todo: make it async

const addTransferInfoToJourney = (j) => {
	// There may be walking legs in between.
	// todo: still show where to get off
	for (let i = 0; i < (j.legs.length - 1); i++) {
		const fromL = j.legs[i]
		if (!fromL.line || !fromL.line.public || !fromL.passed) continue
		const toL = j.legs[i + 1]
		if (!toL.line || !toL.line.public || !toL.passed) continue

		const fromS = fromL.destination.id
		const fromT = fromL.arrivalPlatform

		const fromIndex = fromL.passed.findIndex((p) => {
			return p.station && p.station.id === fromS
		})
		let prev = fromL.passed[fromIndex - 1]
		prev = prev && prev.station && prev.station.id
		if (!prev) continue

		const toS = toL.origin.id
		const toT = toL.departurePlatform

		const toIndex = toL.passed.findIndex((p) => {
			return p.station && p.station.id === toS
		})
		let next = toL.passed[toIndex + 1]
		next = next && next.station && next.station.id
		if (!next) continue

		const sig = [prev, fromS, toS, next].join('-')
		if (!Array.isArray(changePositions[sig])) continue
		for (let item of changePositions[sig]) {
			if (fromT && item.fromTrack && fromT !== item.fromTrack) continue
			if (toT && item.toTrack && toT !== item.toTrack) continue
			// todo: respect item.fromLines, item.toLines

			fromL.arrivalPosition = item.fromPosition
			toL.departurePosition = item.toPosition
			break
		}
	}
}

// todo: this is uglfy, build something cleaner
addTransferInfoToJourney.import = importTask
module.exports = addTransferInfoToJourney
