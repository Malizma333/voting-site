import { RankedBracket } from './RankedBracket.js'

export class BracketVoter {
  constructor (youtubePlaylist) {
    this.youtubePlaylist = youtubePlaylist
    this.bracket = new RankedBracket(youtubePlaylist)
    this.currentCompetition = this.bracket.popQueue()
    this.standings = []
  }

  getCurrentMatch () {
    return this.currentCompetition
  }

  getFinished () {
    return this.currentCompetition === undefined
  }

  decideMatch (winner) {
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

  restartBracket () {
    this.youtubePlaylist.length = 0
    this.youtubePlaylist.push(...this.standings.map((c) => ({ ...c.competitorData, rating: c.rating })))
    this.standings.length = 0
    this.bracket = new RankedBracket(this.youtubePlaylist)
    this.currentCompetition = this.bracket.popQueue()
  }
}
