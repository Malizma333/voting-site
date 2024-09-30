window.onload = async () => {
  const req = await fetch("/api/youtube_data");
  const youtubePlaylist = await req.json();
  console.log(youtubePlaylist);

  const votingForm = document.querySelector("form");
  const radioGroup = votingForm.querySelector("sl-radio-group");
  const submitButton = votingForm.querySelector("sl-button");

  submitButton.disabled = false;

  votingForm.onsubmit = (e) => {
    e.preventDefault();
    if (radioGroup.value == '') return;
    console.log(radioGroup.value);
    radioGroup.value = '';
  }
}