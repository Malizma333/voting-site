window.onload = async () => {
  const req = await fetch("/api/youtube_data");
  const youtubePlaylist = await req.json();

  const votingFormEl = document.querySelector("form");
  const radioGroupEl = votingFormEl.querySelector("sl-radio-group");
  const submitButtonEl = votingFormEl.querySelector("sl-button");

  const videoOneEl = votingFormEl.querySelector(".video-one");
  const videoTwoEl = votingFormEl.querySelector(".video-two");
  const radioOneEl = votingFormEl.querySelector("sl-radio-button[value=\"1\"]");
  const radioTwoEl = votingFormEl.querySelector("sl-radio-button[value=\"2\"]");

  videoOneEl.src = "https://www.youtube.com/embed/" + youtubePlaylist[0][1];
  videoTwoEl.src = "https://www.youtube.com/embed/" + youtubePlaylist[1][1];
  radioOneEl.innerHTML = youtubePlaylist[0][0];
  radioTwoEl.innerHTML = youtubePlaylist[1][0];

  submitButtonEl.disabled = false;

  votingFormEl.onsubmit = (e) => {
    e.preventDefault();
    if (radioGroupEl.value == '') return;
    // console.log(radioGroupEl.value);
    radioGroupEl.value = '';
  }
}