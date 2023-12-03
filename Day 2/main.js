#!/usr/bin/env node

const fs = require('node:fs/promises')

// Classes

class CubeSet {
    constructor(cubeSet) {
        const cubes = cubeSet.split(',')

        this.red = 0
        this.green = 0
        this.blue = 0

        cubes.forEach((cube) => {
            if (cube.endsWith('red')) {
                this.red = parseInt(cube.substring(0, cube.length - 4))
            } else if (cube.endsWith('green')) {
                this.green = parseInt(cube.substring(0, cube.length - 6))
            } else {
                this.blue = parseInt(cube.substring(0, cube.length - 5))
            }
        })
    }
}

class Game {
    constructor(line) {
        this.line = line

        const [ id, subset ] = line.split(':')
        const cubeSets = subset.split(';')

        this.id = parseInt(id.substring(5), 10)
        this.maxRed = 0
        this.maxGreen = 0
        this.maxBlue = 0
        this.cubeSets = cubeSets.map((cubeSet) => {
            const cubeSetObj = new CubeSet(cubeSet)

            this.maxRed = Math.max(this.maxRed, cubeSetObj.red)
            this.maxGreen = Math.max(this.maxGreen, cubeSetObj.green)
            this.maxBlue = Math.max(this.maxBlue, cubeSetObj.blue)
        })
    }

    checkForPossibility(red, green, blue) {
        return this.maxRed <= red && this.maxGreen <= green && this.maxBlue <= blue
    }

    minimumSetPower() {
        return this.maxRed * this.maxGreen * this.maxBlue
    }
}

// Main

(async () => {
    const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')

    let partOneSum = 0
    let partTwoSum = 0

    lines.forEach((line) => {
        if (line.length === 0) {
            return
        }

        const game = new Game(line)
        if (game.checkForPossibility(12, 13, 14)) {
            partOneSum += game.id
        }

        partTwoSum += game.minimumSetPower()
    })

    console.log(`Part One: ${partOneSum}`)
    console.log(`Part Two: ${partTwoSum}`)
})();
