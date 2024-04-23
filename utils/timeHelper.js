module.exports = class TimeHelper {
	static toSeconds(time) {
		const [hour, min, sec] = time.split(':')
		return +sec + 60 * +min + 3600 * +hour
	}

	static toTimeString(seconds) {
		const sec = seconds % 60
		const min = ((seconds - sec) / 60) % 60
		const hour = (seconds - min * 60 - sec) / 3600

		return `${hour >= 10 ? hour.toString() : '0' + hour}:${
			min >= 10 ? min.toString() : '0' + min
		}:${sec >= 10 ? sec.toString() : '0' + sec}`
	}

	static secDifference(start, end) {
		return this.toSeconds(end) - this.toSeconds(start)
	}

	static timeDifference(start, end) {
		const secDiff = this.secDifference(start, end)
		return this.toTimeString(secDiff)
	}

	static divide(start, end, divider) {
		const secDiff = this.secDifference(start, end)
		const dividerSec = divider * 60

		if (secDiff % dividerSec !== 0) return -1
		return secDiff / dividerSec
	}

	static addMinutes(base, additive) {
		const baseSec = this.toSeconds(base)
		const sumSec = baseSec + additive * 60
		return this.toTimeString(sumSec)
	}
}
