class CompetitorNode {
  constructor (competitor, rating) {
    this.competitor = competitor
    this.rating = rating
    this.matchL = undefined
    this.matchR = undefined
  }

  resolveMatch (rightWins) {
    let winner, loser
    if (rightWins === 0) {
      winner = this.matchL
      loser = this.matchR
    } else {
      winner = this.matchR
      loser = this.matchL
    }

    const K = 32
    const probDelta = Math.floor(K / (1 + Math.pow(10, (winner.rating - loser.rating) / 400)))

    loser.rating -= probDelta

    this.competitor = winner.competitor
    this.rating += probDelta
    this.matchL = undefined
    this.matchR = undefined
    return loser
  }

  addMatch (other, otherRating) {
    this.matchL = new CompetitorNode(this.competitor, this.rating)
    this.matchR = new CompetitorNode(other, otherRating)
    this.competitor = null
  }
}

class ELOBracket {
  constructor (competitorArray) {
    let rating = 1000;
    if(competitorArray[0]['rating'] !== undefined) {
      rating = competitorArray[0]['rating']
    }

    this.rootCompetitor = new CompetitorNode(competitorArray[0], rating)
    this.competitionQueue = []
    const queue = [this.rootCompetitor]

    for (let i = 1; i < competitorArray.length; i++) {
      rating = 1000;
      if(competitorArray[i]['rating'] !== undefined) {
        rating = competitorArray[i]['rating']
      }
      const nextCompetitor = queue.shift()
      nextCompetitor.addMatch(competitorArray[i], rating)
      queue.push(nextCompetitor.matchL)
      queue.push(nextCompetitor.matchR)
      this.competitionQueue.push(nextCompetitor)
    }
  }

  popCompetition () {
    if (this.competitionQueue.length === 0) {
      return null
    }

    return this.competitionQueue.pop()
  }
}

function populateCompetitionUI (votingFormEl, competition, final = false) {
  const leftVideoEl = votingFormEl.querySelector('.video-l')
  const rightVideoEl = votingFormEl.querySelector('.video-r')
  const leftRadioEl = votingFormEl.querySelector('sl-radio-button[value="left"]')
  const rightRadioEl = votingFormEl.querySelector('sl-radio-button[value="right"]')
  const nextButtonEl = votingFormEl.querySelector('sl-button[type="submit"]')

  leftVideoEl.src = 'https://www.youtube.com/embed/' + competition.matchL.competitor[1]
  rightVideoEl.src = 'https://www.youtube.com/embed/' + competition.matchR.competitor[1]
  leftRadioEl.innerHTML = competition.matchL.competitor[0]
  rightRadioEl.innerHTML = competition.matchR.competitor[0]

  if (final) {
    nextButtonEl.innerHTML = 'Finish'
  }
}

async function initPlaylist () {
  const ytStorageKey = 'YOUTUBE_NOMINATION_PLAYLIST'

  let youtubePlaylist = JSON.parse(window.localStorage.getItem(ytStorageKey))

  if (youtubePlaylist === null) {
    const req = await fetch('/api/youtube_data')
    youtubePlaylist = await req.json()

    if (req.status !== 200) {
      console.error('[Youtube API]', req.statusText)
      return null
    }

    if (youtubePlaylist.includes('Error')) {
      console.error('[Youtube API]', youtubePlaylist)
      return null
    }

    window.localStorage.setItem(ytStorageKey, JSON.stringify(youtubePlaylist))
  }

  return youtubePlaylist
}

window.onload = async () => {
  const youtubePlaylist = await initPlaylist()

  if (youtubePlaylist === null) {
    // TODO: Display proper error UI
    return
  }

  const tabGroupEl = document.querySelector('sl-tab-group')
  const eloTabEl = tabGroupEl.querySelector('sl-tab-panel[name="elo-vote"]')
  const eloResultsEl = eloTabEl.querySelector('div[class="elo-results"]')
  const votingFormEl = eloTabEl.querySelector('form')
  const radioGroupEl = votingFormEl.querySelector('sl-radio-group')
  const nextButtonEl = votingFormEl.querySelector('sl-button[type="submit"]')
  const refineButtonEl = eloResultsEl.querySelector('sl-button[class="refine-button"]')
  const submitButtonEl = eloResultsEl.querySelector('sl-button[class="submit-button"]')

  let bracket = new ELOBracket(youtubePlaylist)
  let currentCompetition = bracket.popCompetition()
  populateCompetitionUI(votingFormEl, currentCompetition)
  const standings = []

  radioGroupEl.addEventListener('sl-change', function (_) {
    if (radioGroupEl.value === '') {
      nextButtonEl.disabled = true
    } else {
      nextButtonEl.disabled = false
    }
  })

  votingFormEl.addEventListener('submit', function (e) {
    e.preventDefault()

    nextButtonEl.disabled = true

    if (radioGroupEl.value === '') {
      return
    }

    let loser

    if (radioGroupEl.value === 'left') {
      loser = currentCompetition.resolveMatch(0)
    } else {
      loser = currentCompetition.resolveMatch(1)
    }

    standings.push(loser)

    currentCompetition = bracket.popCompetition()

    if (currentCompetition === null) {
      standings.push(bracket.rootCompetitor)
      standings.sort((c1, c2) => c2.rating - c1.rating)
      youtubePlaylist.length = 0
      youtubePlaylist.push(...standings.map((c) => ({...c.competitor, 'rating': c.rating})))

      for (let i = 0; i < 10; i++) {
        eloResultsEl.querySelector('ol').innerHTML += `<li>${standings[i].competitor[0]}</li>`
      }

      eloResultsEl.style.display = 'flex'
      votingFormEl.style.display = 'none'
      return
    }

    const isFinale = bracket.competitionQueue.length === 0
    populateCompetitionUI(votingFormEl, currentCompetition, isFinale)

    radioGroupEl.value = ''
  })

  refineButtonEl.addEventListener('click', function (e) {
    eloResultsEl.querySelector('ol').innerHTML = ''
    eloResultsEl.style.display = 'none'
    votingFormEl.style.display = 'flex'
    nextButtonEl.innerHTML = 'Next'

    console.log(youtubePlaylist)

    bracket = new ELOBracket(youtubePlaylist)
    currentCompetition = bracket.popCompetition()
    populateCompetitionUI(votingFormEl, currentCompetition)
    standings.length = 0
  })

  eloResultsEl.style.display = 'none'

//   for (let i = 1; i < youtubePlaylist.length; i++) {
//     radioGroupEl.value = 'left'
//     votingFormEl.dispatchEvent(new window.SubmitEvent('submit', { submitter: nextButtonEl }))
//   }
// 
//   radioGroupEl.value = ''
}
