#!/usr/bin/env node

const fs = require('node:fs/promises')

// Methods

// Used to get the full number by search left and right from an index to find where the digits end
function getNumber(line, index) {
  if (line[index].match(/\d/) === null) {
    return undefined
  }

  let number = [line[index]]
  let leftFound = false
  let rightFound = false
  let searchIndex = 0
  while (1) {
    searchIndex++

    if (!leftFound && line[index - searchIndex] && line[index - searchIndex].match(/\d/) !== null) {
      number.splice(0, 0, line[index - searchIndex])
    } else {
      leftFound = true
    }

    if (!rightFound && line[index + searchIndex] && line[index + searchIndex].match(/\d/) !== null) {
      number.push(line[index + searchIndex])
    } else {
      rightFound = true
    }

    if (leftFound && rightFound) {
      break
    }
  }

  return parseInt(number.join(''), 10)
}

function parseGearRatioSum(lines) {
  const gears = [...lines[1].matchAll(/\*/g)]
  let sum = 0

  gears.forEach((gear) => {
    const adjacentNumbers = []

    for (const line of lines) {
      // Used to prevent parsing the same number if multiple digits are adjacent to the gear
      let inNumber = false
      for (let index = gear.index - 1; index < gear.index + 2; index++) {
        const number = getNumber(line, index)
        if (number !== undefined) {
          if (!inNumber) adjacentNumbers.push(number)
          inNumber = true
        } else {
          inNumber = false
        }
      }
    }

    // We only care if two or more numbers are adjacent to the gear
    if (adjacentNumbers.length < 2) {
      return
    }

    // Get our gear ratio and sum it up
    sum += adjacentNumbers.reduce((product, number) => {
      return product * number
    })
  }, 0)

  return sum
}

function parsePartNumberSum(lines) {
  const numbers = [...lines[1].matchAll(/\d+/g)]

  return numbers.reduce((sum, number) => {
    for (const line of lines) {
      if (
        line.length >= number.index - 1 &&
        line.substring(number.index - 1, number.index + number[0].length + 1).replace(/[\d.]+/, '').length > 0
      ) {
        return sum + parseInt(number[0], 10)
      }
    }

    return sum
  }, 0)
}

// Main

;(async () => {
  const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')

  let partNumberSum = 0
  let gearRatioSum = 0

  lines.forEach((line, index) => {
    if (line.length === 0) {
      return
    }

    const prevLine = index === 0 ? '' : lines[index - 1]
    const nextLine = index === line.length - 1 ? '' : lines[index + 1]

    partNumberSum += parsePartNumberSum([prevLine, line, nextLine])
    gearRatioSum += parseGearRatioSum([prevLine, line, nextLine])
  })

  console.log(`Part One: ${partNumberSum}`)
  console.log(`Part Two: ${gearRatioSum}`)
})()
