#!/usr/bin/env node

const fs = require('node:fs/promises')

// Prototypes

String.prototype.reverse = function () {
  return this.split('').reverse().join('')
}

String.prototype.insert = function (string, index) {
  return this.substring(0, index) + string + this.substring(index)
}

// Globals

const wordMap = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}
const wordMapRegExp = new RegExp(`(${Object.keys(wordMap).join('|')})`)

let reverseWordMap = {}
Object.keys(wordMap).forEach((key) => {
  reverseWordMap[key.reverse()] = wordMap[key]
})
const reverseWordMapExp = new RegExp(`(${Object.keys(reverseWordMap).join('|')})`)

// Methods

function parseFirstAndLastWords(line) {
  const firstMatch = line.match(wordMapRegExp)
  if (firstMatch === null) {
    return line
  }

  line = line.insert(wordMap[firstMatch[0]], firstMatch.index)
  line = line.reverse()

  const lastMatch = line.match(reverseWordMapExp)
  if (lastMatch !== null) {
    line = line.insert(reverseWordMap[lastMatch[0]], lastMatch.index)
  }

  return line.reverse()
}

function parseFirstAndLastNumbers(line, includeWords) {
  let first = undefined
  let last = undefined

  if (includeWords) {
    line = parseFirstAndLastWords(line)
  }

  for (let i = 0; i < line.length; i++) {
    if (first === undefined && !isNaN(parseInt(line[i], 10))) {
      first = line[i]
    }

    if (last === undefined && !isNaN(parseInt(line[line.length - 1 - i], 10))) {
      last = line[line.length - 1 - i]
    }

    if (first !== undefined && last !== undefined) {
      break
    }
  }

  return parseInt(first + last, 10)
}

function solution(lines, includeWords) {
  let calibrationValueSum = 0

  lines.forEach((line) => {
    if (line.length === 0) {
      return
    }

    calibrationValueSum += parseFirstAndLastNumbers(line, includeWords)
  })

  return calibrationValueSum
}

// Main

;(async () => {
  const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')

  console.log(`Part One: ${solution(lines, false)}`)
  console.log(`Part Two: ${solution(lines, true)}`)
})()
