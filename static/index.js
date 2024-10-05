import { BracketVoter } from './classes/BracketVoter.js'
import { PlaylistLoader } from './classes/PlaylistLoader.js'

async function populateComparisonVoteTab () {
  const youtubePlaylist = await PlaylistLoader.initPlaylist()

  if (youtubePlaylist === null) {
    const compareVotingResults = document.getElementById('compareVotingResults')
    const compareVotingForm = document.getElementById('compareVotingForm')
    const compareSuccessConfirm = document.getElementById('compareSuccessConfirm')
    compareVotingResults.style.display = 'none'
    compareSuccessConfirm.style.display = 'none'
    compareVotingForm.style.display = 'none'

    const compareError = document.getElementById('compareError')
    compareError.style.display = 'flex'
    compareError.innerHTML = 'Error loading Youtube Playlist. See console for more information.'
    return
  }

  const bracketVoterLogic = new BracketVoter(youtubePlaylist)

  const compareVotingResults = document.getElementById('compareVotingResults')
  const compareVotingForm = document.getElementById('compareVotingForm')
  const compareSuccessConfirm = document.getElementById('compareSuccessConfirm')
  const refineCompareResults = document.getElementById('refineCompareResults')
  const submitCompareResults = document.getElementById('submitCompareResults')
  const compareRadioGroup = document.getElementById('compareRadioGroup')
  const nextCompareButton = document.getElementById('nextCompareButton')
  const leftCompareVideo = document.getElementById('leftCompareVideo')
  const rightCompareFrame = document.getElementById('rightCompareFrame')
  const leftCompareRadio = document.getElementById('leftCompareRadio')
  const rightCompareRadio = document.getElementById('rightCompareRadio')

  leftCompareVideo.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
  rightCompareFrame.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
  leftCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
  rightCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]

  compareRadioGroup.addEventListener('sl-change', function (_) {
    if (compareRadioGroup.value === '') {
      nextCompareButton.disabled = true
    } else {
      nextCompareButton.disabled = false
    }
  })

  compareVotingForm.addEventListener('submit', function (e) {
    e.preventDefault()

    nextCompareButton.disabled = true

    if (compareRadioGroup.value === '') {
      return
    }

    bracketVoterLogic.decideMatch(compareRadioGroup.value)

    if (bracketVoterLogic.getFinished()) {
      for (let i = 0; i < 10; i++) {
        compareVotingResults.querySelector('ol').innerHTML += `<li>${bracketVoterLogic.standings[i].competitorData[0]}</li>`
      }

      compareVotingResults.style.display = 'flex'
      compareVotingForm.style.display = 'none'
    } else {
      leftCompareVideo.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
      rightCompareFrame.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
      leftCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
      rightCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]

      if (bracketVoterLogic.bracket.lastRound()) {
        nextCompareButton.innerHTML = 'Finish'
      }

      compareRadioGroup.value = ''
    }
  })

  refineCompareResults.addEventListener('click', function (_) {
    compareVotingResults.querySelector('ol').innerHTML = ''
    compareVotingResults.style.display = 'none'
    compareVotingForm.style.display = 'flex'
    nextCompareButton.innerHTML = 'Next'

    bracketVoterLogic.restartBracket()

    leftCompareVideo.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchL.competitorData[1]
    rightCompareFrame.src = 'https://www.youtube.com/embed/' + bracketVoterLogic.currentCompetition.matchR.competitorData[1]
    leftCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchL.competitorData[0]
    rightCompareRadio.innerHTML = bracketVoterLogic.currentCompetition.matchR.competitorData[0]
  })

  submitCompareResults.addEventListener('click', function (_) {
    compareVotingResults.style.display = 'none'
    compareVotingForm.style.display = 'none'
    compareSuccessConfirm.style.display = 'flex'
  })

  compareVotingResults.style.display = 'none'
  compareSuccessConfirm.style.display = 'none'
}

window.onload = () => {
  populateComparisonVoteTab()
}
