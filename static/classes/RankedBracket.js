import { CompetitorNode } from './CompetitorNode.js'

/**
 * Maintains a bracket of competitors by constructing a bracket tree of matchings, then pushing each competitor node
 * reference to a queue. This queue can be popped from later to prompt user decision on how to determine the bracket.
 */
export class RankedBracket {
  /**
   * @param {Array<Object>} objectArray Array of objects to create competition tree from
   */
  constructor (objectArray) {
    const competitorArray = objectArray.map((o) => new CompetitorNode(o, o.rating))

    /** @type {CompetitorNode} @public The root match of the bracket tree */
    this.rootCompetitor = competitorArray[0]
    /** @type {Array<CompetitorNode>} @public A queue of matches to resolve */
    this.competitionQueue = []

    const queue = [this.rootCompetitor]

    for (let i = 1; i < competitorArray.length; i++) {
      const nextCompetitor = queue.shift()
      nextCompetitor.createMatch(competitorArray[i])
      queue.push(nextCompetitor.matchL)
      queue.push(nextCompetitor.matchR)
      this.competitionQueue.push(nextCompetitor)
    }
  }

  /**
   * Removes and returns the last match in the competition queue.
   * @returns {CompetitorNode}
   */
  popQueue () {
    return this.competitionQueue.pop()
  }

  /**
   * Returns if the competition queue is empty and the bracket is finished.
   * @returns {boolean}
   */
  lastRound () {
    return this.competitionQueue.length === 0
  }

  /**
   * Returns the root competitor node
   * @returns {CompetitorNode}
   */
  getRoot () {
    return this.rootCompetitor
  }
}
