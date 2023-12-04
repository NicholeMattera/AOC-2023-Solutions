#!/usr/bin/env node

const fs = require('node:fs/promises')

class Card {
    constructor(line) {
        const [ id, data ] = line.split(':')
        const [ winningNumberSet, numberSet ] = data.split('|')

        const winningNumbers = this._parseNumbers(winningNumberSet)
        const numbers = this._parseNumbers(numberSet)

        this.id = parseInt(id.substring(5), 10)
        this.points = this._calculatePointValue(winningNumbers, numbers)
        this.scratchcardsWon = this._calculateScratchcardsWon(winningNumbers, numbers)
    }

    _parseNumbers(numberSet) {
        return numberSet.split(' ')
                        .filter((item) => {
                            return item.length !== 0
                        })
                        .map((item) => parseInt(item, 10))
    }

    _calculatePointValue(winningNumbers, numbers) {
        return numbers.reduce((points, number) => {
            if (winningNumbers.includes(number)) {
                if (points === 0) {
                    return 1
                } else {
                    return points * 2
                }
            }

            return points
        }, 0)
    }

    _calculateScratchcardsWon(winningNumbers, numbers) {
        return numbers.reduce((scratchcards, number) => {
            if (winningNumbers.includes(number)) {
                return scratchcards + 1
            }

            return scratchcards
        }, 0)
    }

    totalScratchCardsWon(cards) {
        let totalCards = this.scratchcardsWon
        const cardsWon = cards.slice(this.id, this.id + totalCards)
        cardsWon.forEach((card) => {
            totalCards += card.totalScratchCardsWon(cards)
        })
        return totalCards
    }
}

// Main

(async () => {
    const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')
    const cards = lines.filter((line) => line.length !== 0)
                       .map((line) => new Card(line))

    let pointSum = 0
    let totalCards = cards.length
    
    cards.forEach((card) => {
        totalCards += card.totalScratchCardsWon(cards)
        pointSum += card.points
    })

    console.log(`Part One: ${pointSum}`)
    console.log(`Part Two: ${totalCards}`)
})();
