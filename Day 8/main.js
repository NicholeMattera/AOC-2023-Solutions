#!/usr/bin/env node

const fs = require('node:fs/promises')

// Prototypes

Array.prototype.toReversed = function () {
  const result = [...this]
  result.reverse()
  return result
}

Math.gcd = function (a, b) {
  return !b ? a : Math.gcd(b, a % b)
}

Math.lcm = function (a, b) {
  if (Array.isArray(a)) {
    return a.reduce((result, number) => {
      return Math.lcm(number, result)
    })
  }

  return a * (b / Math.gcd(a, b))
}

// Classes

class Map {
  constructor(lines) {
    this.instructions = this._parseInstructions(lines[0])
    this.nodes = this._parseNodes(lines.slice(2))
  }

  _getGhostsStartingNodes() {
    return Object.keys(this.nodes)
      .filter((location) => location.toUpperCase().endsWith('A'))
      .map((location) => this.nodes[location])
  }

  _parseInstructions(line) {
    return line.split('').map((direction) => (direction.toUpperCase() === 'L' ? 0 : 1))
  }

  _parseNodes(lines, limit = 0) {
    const nodes = {}
    let nodesParsed = 0
    for (const line of lines) {
      if (line.length === 0) continue

      const node = new Node(line)
      nodes[node.location] = node

      nodesParsed++
      if (limit !== 0 && nodesParsed >= limit) {
        break
      }
    }

    return limit === 1 ? Object.values(nodes)[0] : nodes
  }

  getNumberOfStepsToEnd(startingLocation, endingLocation) {
    let numberOfSteps = 0
    let currentNode = this.nodes[startingLocation]
    while (true) {
      const instruction = this.instructions[numberOfSteps % this.instructions.length]
      currentNode = this.nodes[currentNode.direction[instruction]]
      numberOfSteps++

      if (currentNode.location.endsWith(endingLocation)) {
        return numberOfSteps
      }
    }
  }

  getNumberOfStepsToEndForAllGhosts() {
    const stepsToIndividualGhostEnds = this._getGhostsStartingNodes().map((node) => {
      return this.getNumberOfStepsToEnd(node.location, 'Z')
    })

    return Math.lcm(stepsToIndividualGhostEnds)
  }
}

class Node {
  constructor(line) {
    const matches = line.match(/(.*) = \((.*), (.*)\)/)
    this.location = matches[1]
    this.direction = [matches[2], matches[3]]
  }
}

// Main

;(async () => {
  const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')
  const map = new Map(lines)

  console.log(`Part One: ${map.getNumberOfStepsToEnd('AAA', 'ZZZ')}`)
  console.log(`Part Two: ${map.getNumberOfStepsToEndForAllGhosts()}`)
})()
