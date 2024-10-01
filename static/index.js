class CompetitorNode {
  constructor(competitor) {
    this.competitor = competitor;
    this.rating = 1000;
    this.matchL = undefined;
    this.matchR = undefined;
  }

  resolveMatch(rightWins) {
    let winner, loser;
    if(rightWins === 0) {
      winner = this.matchL;
      loser = this.matchR;
    } else {
      winner = this.matchR;
      loser = this.matchL;
    }

    // TODO: This formula is probably wrong
    const probLoser = 1 / (1 + Math.pow(10, (winner.rating - loser.rating) / 400));
    const K = 30;

    loser.rating -= K * probLoser;

    this.competitor = winner.competitor;
    this.rating += K * probLoser;
    this.matchL = undefined;
    this.matchR = undefined;
    return loser;
  }

  addMatch(other) {
    this.matchL = new CompetitorNode(this.competitor);
    this.matchR = new CompetitorNode(other);
    this.competitor = null;
  }
}

class ELOBracket {
  constructor(competitorArray) {
    this.rootCompetitor = new CompetitorNode(competitorArray[0]);
    this.competitionQueue = [];
    let queue = [this.rootCompetitor];
    
    for(let i = 1; i < competitorArray.length; i++) {
      let nextCompetitor = queue.shift();
      nextCompetitor.addMatch(competitorArray[i]);
      queue.push(nextCompetitor.matchL);
      queue.push(nextCompetitor.matchR);
      this.competitionQueue.push(nextCompetitor);
    }
  }

  popCompetition() {
    if(this.competitionQueue.length == 0) {
      return null;
    }

    return this.competitionQueue.pop();
  }
}

function populateCompetitionUI(votingFormEl, competition, final = false) {
  const leftVideoEl = votingFormEl.querySelector(".video-l");
  const rightVideoEl = votingFormEl.querySelector(".video-r");
  const leftRadioEl = votingFormEl.querySelector("sl-radio-button[value=\"left\"]");
  const rightRadioEl = votingFormEl.querySelector("sl-radio-button[value=\"right\"]");
  const submitButtonEl = votingFormEl.querySelector("sl-button[type=\"submit\"]");

  leftVideoEl.src = "https://www.youtube.com/embed/" + competition.matchL.competitor[1];
  rightVideoEl.src = "https://www.youtube.com/embed/" + competition.matchR.competitor[1];
  leftRadioEl.innerHTML = competition.matchL.competitor[0] + competition.matchL.rating;
  rightRadioEl.innerHTML = competition.matchR.competitor[0] + competition.matchR.rating;

  if(final) {
    submitButtonEl.innerHTML = "Finish"
  }
}

async function initPlaylist() {
  const ytStorageKey = "YOUTUBE_NOMINATION_PLAYLIST";

  let youtubePlaylist = JSON.parse(localStorage.getItem(ytStorageKey));
  
  if(youtubePlaylist === null) {
    const req = await fetch("/api/youtube_data");
    youtubePlaylist = await req.json();

    localStorage.setItem(ytStorageKey, JSON.stringify(youtubePlaylist));
  }

  return youtubePlaylist;
}

window.onload = async () => {
  const youtubePlaylist = await initPlaylist();
  const votingFormEl = document.querySelector("form");
  const submitButtonEl = votingFormEl.querySelector("sl-button[type=\"submit\"]");
  const bracket = new ELOBracket(youtubePlaylist);

  let currentCompetition = bracket.popCompetition();
  populateCompetitionUI(votingFormEl, currentCompetition);
  const standings = [];

  votingFormEl.onsubmit = (e) => {
    e.preventDefault();
    const radioGroupEl = votingFormEl.querySelector("sl-radio-group");

    if (radioGroupEl.value == '') {
      return;
    }

    let loser;

    if (radioGroupEl.value == 'left') {
      loser = currentCompetition.resolveMatch(0);
    } else {
      loser = currentCompetition.resolveMatch(1);
    }

    standings.push(loser);

    currentCompetition = bracket.popCompetition();

    if(currentCompetition == null) {
      standings.push(bracket.rootCompetitor);
      for(const competitor of standings) {
        console.log(competitor.competitor, competitor.rating);
      }
      
      submitButtonEl.disabled = true;
      return;
    }

    const isFinale = bracket.competitionQueue.length === 0;
    populateCompetitionUI(votingFormEl, currentCompetition, isFinale);

    radioGroupEl.value = '';
  }

  submitButtonEl.disabled = false;
}