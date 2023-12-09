#!/usr/bin/env node

const fs = require('node:fs/promises')

// Functions

function getStepDifferences(steps) {
  const result = []
  for (let i = 1; i < steps.length; i++) {
    result.push(steps[i] - steps[i - 1])
  }
  return result
}

function predictNextStep(steps) {
  const stepDifferences = getStepDifferences(steps)

  if (stepDifferences.every((stepDifference) => stepDifference === stepDifferences[0])) {
    return steps[steps.length - 1] + stepDifferences[stepDifferences.length - 1]
  }

  return steps[steps.length - 1] + predictNextStep(stepDifferences)
}

function predictPreviousStep(steps) {
  const stepDifferences = getStepDifferences(steps)

  if (stepDifferences.every((stepDifference) => stepDifference === stepDifferences[0])) {
    return steps[0] - stepDifferences[0]
  }

  return steps[0] - predictPreviousStep(stepDifferences)
}

// Main

;(async () => {
  const values = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' }))
    .split('\n')
    .filter((line) => line.length !== 0)
    .map((line) => line.split(' ').map((number) => parseInt(number, 10)))

  const { partOne, partTwo } = values.reduce(
    (extrapolatedValueSums, steps) => {
      return {
        partOne: extrapolatedValueSums.partOne + predictNextStep(steps),
        partTwo: extrapolatedValueSums.partTwo + predictPreviousStep(steps),
      }
    },
    {
      partOne: 0,
      partTwo: 0,
    }
  )

  console.log(`Part One: ${partOne}`)
  console.log(`Part Two: ${partTwo}`)
})()
