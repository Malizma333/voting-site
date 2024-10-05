import { RankedBracket } from './RankedBracket.js'

/**
 * Keeps track of bracket comparison voting system using ranked bracket class
 */
export class BracketVoter {
  /**
   * @param {Array<Object>} youtubePlaylist Youtube videos to rank in a bracket
   */
  constructor (youtubePlaylist) {
    /** @type {Array<Object>} @public */
    this.youtubePlaylist = youtubePlaylist
    /** @type {RankedBracket} @public */
    this.bracket = new RankedBracket(youtubePlaylist)
    /** @type {CompetitorNode} @public */
    this.currentCompetition = this.bracket.popQueue()
    /** @type {Array<CompetitorNode>} @public */
    this.standings = []
  }

  /**
   * Returns the current comparison match in going on.
   * @returns {CompetitorNode}
   */
  getCurrentMatch () {
    return this.currentCompetition
  }

  /**
   * Returns whether the current comparison match going on is undefined, meaning that the bracket voting is finished.
   * @returns {boolean}
   */
  getFinished () {
    return this.currentCompetition === undefined
  }

  /**
   * Decides match between left and right comparison and updates the appropriate class variables.
   * @param {'left'|'right'} winner String describing which side of the comparison won.
   * @returns {undefined}
   */
  decideMatch (winner) {
    if (winner !== 'left' && winner !== 'right') {
      throw new Error('[BracketVoter] Winner must be left or right!')
    }

    let loser

    if (winner === 'left') {
      loser = this.currentCompetition.resolveMatch(0)
    } else {
      loser = this.currentCompetition.resolveMatch(1)
    }

    this.standings.push(loser)
    this.currentCompetition = this.bracket.popQueue()

    if (this.currentCompetition === undefined) {
      this.standings.push(this.bracket.getRoot())
      this.standings.sort((c1, c2) => c2.rating - c1.rating)
    }
  }

  /**
   * Restarts the bracket by using the results from the previous tournament.
   * @returns {CompetitorNode}
   */
  restartBracket () {
    this.youtubePlaylist.length = 0
    this.youtubePlaylist.push(...this.standings.map((c) => ({ ...c.competitorData, rating: c.rating })))
    this.standings.length = 0
    this.bracket = new RankedBracket(this.youtubePlaylist)
    this.currentCompetition = this.bracket.popQueue()
  }
}
