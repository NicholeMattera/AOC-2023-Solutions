#!/usr/bin/env node

const fs = require('node:fs/promises')

class Race {
    constructor(time, distance) {
        this.time = time
        this.distance = distance
    }

    getNumberOfWaysToWin() {
        let wins = 0
        for (let t = 1; t < this.time; t++) {
            const traveled = t * (this.time - t)
            if (traveled > this.distance) {
                wins++
            }
        }
        return wins
    }
}

class RaceManager {
    constructor(lines) {
        let times
        let distances
        lines.forEach(line => {
            if (line.startsWith('Time:')) {
                times = line.substring(5)
                            .trim()
                            .replaceAll(/\s+/g, ',')
                            .split(',')
                            .map((item) => parseInt(item, 10))
                
                this.actualTime = parseInt(
                    line.substring(5)
                        .trim()
                        .replaceAll(/\s+/g, ''),
                    10
                )
            } else if (line.startsWith('Distance:')) {
                distances = line.substring(9)
                                .trim()
                                .replaceAll(/\s+/g, ',')
                                .split(',')
                                .map((item) => parseInt(item, 10))
                
                this.actualDistance = parseInt(
                    line.substring(9)
                        .trim()
                        .replaceAll(/\s+/g, ''),
                    10
                )
            }
        });

        this.races = []
        times.forEach((time, index) => {
            if (distances[index] === undefined) {
                return
            }

            this.races.push(new Race(time, distances[index]))
        })
    }

    partOne() {
        let result
        this.races.forEach((race) => {
            if (result === undefined) {
                result = race.getNumberOfWaysToWin()
            } else {
                result *= race.getNumberOfWaysToWin()
            }
        })

        return result
    }

    partTwo() {
        return (new Race(this.actualTime, this.actualDistance)).getNumberOfWaysToWin()
    }
}

// Main

(async () => {
    const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')    
    const raceManager = new RaceManager(lines)

    console.log(`Part One: ${raceManager.partOne()}`)
    console.log(`Part Two: ${raceManager.partTwo()}`)
})();
