#!/usr/bin/env node

const fs = require('node:fs/promises')

class Hand {
  static CardStrengthMap = [
    // Part 1
    {
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      7: 6,
      8: 7,
      9: 8,
      T: 9,
      J: 10,
      Q: 11,
      K: 12,
      A: 13,
    },
    // Part 2
    {
      J: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      T: 10,
      Q: 11,
      K: 12,
      A: 13,
    },
  ]

  static HandTypes = {
    HighCard: 1,
    OnePair: 2,
    TwoPair: 3,
    ThreeOfAKind: 4,
    FullHouse: 5,
    FourOfAKind: 6,
    FiveOfAKind: 7,
  }

  constructor(line) {
    const [hand, bid] = line.split(' ')
    this.cards = hand.split('')
    this.bid = parseInt(bid, 10)

    // Part 1 Type
    this.type = this._getHandType(false)

    // Part 2 Type
    this.wildcardType = this._getHandType(true)
  }

  _getHandMap(wildcardIncluded) {
    const handMap = {}
    let cardsCounted = 0
    this.cards.forEach((card) => {
      // Part 2 - Ignore wildcards
      if (wildcardIncluded && card === 'J') return

      handMap[card] = handMap[card] === undefined ? 1 : handMap[card] + 1
      cardsCounted++
    })

    // Part 2
    if (wildcardIncluded && cardsCounted === 0) {
      // We got all wildcards
      return Hand.HandTypes.FiveOfAKind
    } else if (wildcardIncluded && cardsCounted !== 5) {
      // Throw our wildcards in with the largest labeled card
      const largestLabel = Object.keys(handMap).reduce((largestLabel, label) =>
        handMap[largestLabel] > handMap[label] ? largestLabel : label
      )

      handMap[largestLabel] += 5 - cardsCounted
    }

    return handMap
  }

  _getHandType(wildcardIncluded) {
    const handMap = this._getHandMap(wildcardIncluded)

    // Figure out our hand type
    const numberOfUniqueCards = Object.keys(handMap).length
    if (numberOfUniqueCards === 5) {
      return Hand.HandTypes.HighCard
    } else if (numberOfUniqueCards === 4) {
      return Hand.HandTypes.OnePair
    } else if (numberOfUniqueCards === 3) {
      if (Object.values(handMap).includes(2)) {
        return Hand.HandTypes.TwoPair
      } else {
        return Hand.HandTypes.ThreeOfAKind
      }
    } else if (numberOfUniqueCards === 2) {
      if (Object.values(handMap).includes(2)) {
        return Hand.HandTypes.FullHouse
      } else {
        return Hand.HandTypes.FourOfAKind
      }
    } else {
      return Hand.HandTypes.FiveOfAKind
    }
  }

  static compare(wildcardIncluded) {
    const typeProperty = wildcardIncluded ? 'wildcardType' : 'type'
    const cardStrengthMapIndex = wildcardIncluded ? 1 : 0

    // Sort our hands by strength
    return (x, y) => {
      if (x[typeProperty] > y[typeProperty]) return 1
      else if (x[typeProperty] < y[typeProperty]) return -1
      else {
        for (let i = 0; i < Math.min(x.cards.length, y.cards.length); i++) {
          const xStrength = Hand.CardStrengthMap[cardStrengthMapIndex][x.cards[i]]
          const yStrength = Hand.CardStrengthMap[cardStrengthMapIndex][y.cards[i]]

          if (xStrength > yStrength) return 1
          else if (xStrength < yStrength) return -1
        }
      }

      return 0
    }
  }
}

// Main

;(async () => {
  const lines = (await fs.readFile('./input', { encoding: 'ascii', flag: 'r' })).split('\n')
  const hands = lines.filter((line) => line.length !== 0).map((line) => new Hand(line))

  const partOne = [...hands].sort(Hand.compare(false)).reduce((solution, hand, index) => {
    return solution + hand.bid * (index + 1)
  }, 0)

  const partTwo = [...hands].sort(Hand.compare(true)).reduce((solution, hand, index) => {
    return solution + hand.bid * (index + 1)
  }, 0)

  console.log(`Part One: ${partOne}`)
  console.log(`Part Two: ${partTwo}`)
})()
