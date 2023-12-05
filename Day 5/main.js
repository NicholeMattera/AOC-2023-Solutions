#!/usr/bin/env node

const fs = require('node:fs/promises')

class Almanac {
    sections = {
        SEED_TO_SOIL: 1,
        SOIL_TO_FERTILIZER: 2,
        FERTILIZER_TO_WATER: 3,
        WATER_TO_LIGHT: 4,
        LIGHT_TO_TEMPERATURE: 5,
        TEMPERATURE_TO_HUMIDITY: 6,
        HUMIDITY_TO_LOCATION: 7
    }

    constructor(lines) {
        const sectionHeaderMap = {
            [this.sections.SEED_TO_SOIL]: 'seed-to-soil',
            [this.sections.SOIL_TO_FERTILIZER]: 'soil-to-fertilizer',
            [this.sections.FERTILIZER_TO_WATER]: 'fertilizer-to-water',
            [this.sections.WATER_TO_LIGHT]: 'water-to-light',
            [this.sections.LIGHT_TO_TEMPERATURE]: 'light-to-temperature',
            [this.sections.TEMPERATURE_TO_HUMIDITY]: 'temperature-to-humidity',
            [this.sections.HUMIDITY_TO_LOCATION]: 'humidity-to-location'
        }

        let currentSection = 0
        let sectionLines = []
        this.maps = {}
        lines.forEach((line) => {
            if (line.startsWith('seeds: ')) {
                this.seedsToPlant = line.substring(7)
                                        .split(' ')
                                        .map((item) => parseInt(item, 10))
                return
            }

            for (const section in sectionHeaderMap) {
                if (line.startsWith(`${sectionHeaderMap[section]} map:`)) {
                    currentSection = section
                    return
                }
            }

            if (line.trim().length === 0) {
                if (currentSection !== 0) {
                    this.maps[currentSection] = new Map(sectionLines)
                }

                currentSection = 0
                sectionLines = []
                return
            }

            sectionLines.push(line)
        })
    }

    getLowestLocation() {
        let lowestLocation

        this.seedsToPlant.forEach((seed) => {
            const soil = this.maps[this.sections.SEED_TO_SOIL].getDestination(seed)
            const fertilizer = this.maps[this.sections.SOIL_TO_FERTILIZER].getDestination(soil)
            const water = this.maps[this.sections.FERTILIZER_TO_WATER].getDestination(fertilizer)
            const light = this.maps[this.sections.WATER_TO_LIGHT].getDestination(water)
            const temperature = this.maps[this.sections.LIGHT_TO_TEMPERATURE].getDestination(light)
            const humidity = this.maps[this.sections.TEMPERATURE_TO_HUMIDITY].getDestination(temperature)
            const location = this.maps[this.sections.HUMIDITY_TO_LOCATION].getDestination(humidity)
            
            if (lowestLocation === undefined || location < lowestLocation) {
                lowestLocation = location
            }
        })

        return lowestLocation
    }

    getLowestLocationUsingAllSeeds() {
        let lowestLocation

        for (var i = 0; i <= this.seedsToPlant.length; i += 2) {
            for (var seed = this.seedsToPlant[i]; seed <= this.seedsToPlant[i] + this.seedsToPlant[i + 1]; seed++) {
                const soil = this.maps[this.sections.SEED_TO_SOIL].getDestination(seed)
                const fertilizer = this.maps[this.sections.SOIL_TO_FERTILIZER].getDestination(soil)
                const water = this.maps[this.sections.FERTILIZER_TO_WATER].getDestination(fertilizer)
                const light = this.maps[this.sections.WATER_TO_LIGHT].getDestination(water)
                const temperature = this.maps[this.sections.LIGHT_TO_TEMPERATURE].getDestination(light)
                const humidity = this.maps[this.sections.TEMPERATURE_TO_HUMIDITY].getDestination(temperature)
                const location = this.maps[this.sections.HUMIDITY_TO_LOCATION].getDestination(humidity)
                
                if (lowestLocation === undefined || location < lowestLocation) {
                    lowestLocation = location
                }
            }
        }

        return lowestLocation
    }
}

class Map {
    constructor(lines) {
        this.ranges = []
        lines.forEach((line) => {
            const [ destination, source, length ] = line.split(' ')
                                                        .map((item) => parseInt(item, 10))
            
            this.ranges.push({
                sourceStart: source,
                sourceEnd: source + length,
                destinationStart: destination
            })
        })
    }

    getDestination(key) {
        for (const range of this.ranges) {
            if (key >= range.sourceStart && key <= range.sourceEnd) {
                return range.destinationStart + (key - range.sourceStart)
            }
        }

        return key
    }
}

// Main

(async () => {
    const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')    
    const almanac = new Almanac(lines)

    console.log(`Part One: ${almanac.getLowestLocation()}`)
    console.log(`Part Two: ${almanac.getLowestLocationUsingAllSeeds()}`)
})();
