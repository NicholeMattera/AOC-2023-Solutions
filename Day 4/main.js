#!/usr/bin/env node

const fs = require('node:fs/promises')

class Card {
  constructor(line) {
    const [id, data] = line.split(':')
    const [winningNumberSet, numberSet] = data.split('|')

    this.id = parseInt(id.substring(5), 10)
    this.winningNumbers = this._parseNumbers(winningNumberSet)
    this.numbers = this._parseNumbers(numberSet)
  }

  _parseNumbers(numberSet) {
    return numberSet
      .split(' ')
      .filter((item) => {
        return item.length !== 0
      })
      .map((item) => parseInt(item, 10))
  }

  get scratchcardsWon() {
    return this.numbers.reduce((scratchcards, number) => {
      if (this.winningNumbers.includes(number)) {
        return scratchcards + 1
      }

      return scratchcards
    }, 0)
  }

  get points() {
    return this.numbers.reduce((points, number) => {
      if (this.winningNumbers.includes(number)) {
        if (points === 0) {
          return 1
        } else {
          return points * 2
        }
      }

      return points
    }, 0)
  }
}

// Methods

function totalScratchCardsWon(cards, card) {
  let totalCards = card.scratchcardsWon
  const cardsWon = cards.slice(card.id, card.id + totalCards)
  cardsWon.forEach((card) => {
    totalCards += totalScratchCardsWon(cards, card)
  })
  return totalCards
}

// Main

;(async () => {
  const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')

  let pointSum = 0

  const cards = lines.filter((line) => line.length !== 0).map((line) => new Card(line))

  let totalCards = cards.length

  cards.forEach((card) => {
    totalCards += totalScratchCardsWon(cards, card)
    pointSum += card.points
  })

  console.log(`Part One: ${pointSum}`)
  console.log(`Part Two: ${totalCards}`)
})()
