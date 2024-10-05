/**
 * Serves a double purpose as a competitor and match node:
 * - If there are no children `matchL` and `matchR`, then this is a competitor node.
 *   Properties `competitorData` and `rating` must be defined.
 * - Else, this is a match node. Properties `competitorData` and `rating` do not have to be defined.
 *
 * This purpose is stored in the `matchFlag` variable.
 */
export class CompetitorNode {
  /**
   * Default rating for a competitor
   */
  static DEFAULT_RATING = 0

  /**
   * @param {Object} data Data to keep track of related to our competitor
   * @param {Number} rating Rating of the new competitior
   */
  constructor (data, rating) {
    /** @type {Object} @public */
    this.competitorData = data
    /** @type {Number} @public */
    this.rating = rating || CompetitorNode.DEFAULT_RATING
    /** @type {CompetitorNode} @public */
    this.matchL = undefined
    /** @type {CompetitorNode} @public */
    this.matchR = undefined
    /** @type {boolean} @private */
    this.matchFlag = false
  }

  /**
   * Resolves this match between its two competitor node children by replacing this match with the winner child and returning the loser child.
   * @param {boolean} rightWins Boolean describing whether the right child of the match won.
   * @returns {CompetitorNode}
   */
  resolveMatch (rightWins) {
    if (!this.matchFlag) {
      throw new Error('Cannot resolve match on competitor!')
    }

    let winner, loser

    if (rightWins) {
      winner = this.matchR
      loser = this.matchL
    } else {
      winner = this.matchL
      loser = this.matchR
    }

    // Replace this match with winner
    this.competitorData = winner.competitorData
    this.rating = winner.rating + 1
    this.matchL = undefined
    this.matchR = undefined
    this.matchFlag = false

    // Return loser
    return loser
  }

  /**
   * Changes this competitor node to a match between this competitor and `other` competitor.
   * @param {CompetitorNode} other
   */
  createMatch (otherCompetitor) {
    if (this.matchFlag) {
      throw new Error('Cannot create match from existing match!')
    }

    this.matchL = new CompetitorNode(this.competitorData, this.rating)
    this.matchR = otherCompetitor
    this.competitorData = null
    this.matchFlag = true
  }
}
