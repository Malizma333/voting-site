import { BracketVoter } from './classes/BracketVoter.js'
import { Debug } from './classes/Debug.js'
import { PlaylistLoader } from './classes/PlaylistLoader.js'

window.onload = async () => {
  const youtubePlaylist = await PlaylistLoader.initPlaylist()

  if (youtubePlaylist === null) {
    // TODO: Display proper error UI
    return
  }

  const bracketVoterLogic = new BracketVoter(youtubePlaylist)

  const tabGroupEl = document.querySelector('sl-tab-group')
  const eloTabEl = tabGroupEl.querySelector('sl-tab-panel[name="elo-vote"]')
  const eloResultsEl = eloTabEl.querySelector('div[class="elo-results"]')
  const votingFormEl = eloTabEl.querySelector('form')
  const eloSubmitEl = eloTabEl.querySelector('div[class="elo-success"]')
  const refineButtonEl = eloResultsEl.querySelector('sl-button[class="refine-button"]')
  const submitButtonEl = eloResultsEl.querySelector('sl-button[class="submit-button"]')
  const radioGroupEl = votingFormEl.querySelector('sl-radio-group')
  const nextButtonEl = votingFormEl.querySelector('sl-button[type="submit"]')
  const leftVideoEl = votingFormEl.querySelector('.video-l')
  const rightVideoEl = votingFormEl.querySelector('.video-r')
  const leftRadioEl = votingFormEl.querySelector('sl-radio-button[value="left"]')
  const rightRadioEl = votingFormEl.querySelector('sl-radio-button[value="right"]')

  leftVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
  rightVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
  leftRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
  rightRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]

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

    bracketVoterLogic.decideMatch(radioGroupEl.value)

    if (bracketVoterLogic.getFinished()) {
      console.log(bracketVoterLogic.standings)
      for (let i = 0; i < 10; i++) {
        eloResultsEl.querySelector('ol').innerHTML += `<li>${bracketVoterLogic.standings[i].competitorData[0]}</li>`
      }

      eloResultsEl.style.display = 'flex'
      votingFormEl.style.display = 'none'
    } else {
      leftVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
      rightVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
      leftRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
      rightRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]

      if (bracketVoterLogic.bracket.lastRound()) {
        nextButtonEl.innerHTML = 'Finish'
      }

      radioGroupEl.value = ''
    }
  })

  refineButtonEl.addEventListener('click', function (_) {
    eloResultsEl.querySelector('ol').innerHTML = ''
    eloResultsEl.style.display = 'none'
    votingFormEl.style.display = 'flex'
    nextButtonEl.innerHTML = 'Next'

    bracketVoterLogic.restartBracket()

    leftVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
    rightVideoEl.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
    leftRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
    rightRadioEl.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]
  })

  submitButtonEl.addEventListener('click', function (_) {
    eloResultsEl.style.display = 'none'
    votingFormEl.style.display = 'none'
    eloSubmitEl.style.display = 'flex'
  })

  Debug.simulateBracketVote(youtubePlaylist.length - 2)

  eloResultsEl.style.display = 'none'
  eloSubmitEl.style.display = 'none'
}
