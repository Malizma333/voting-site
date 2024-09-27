window.onload = () => {
  let choice = -1;

  function onSetChoice(targetChoice) {
    if(next_btn.disabled) {
      next_btn.disabled = false;
    }
    
    choice = targetChoice;

    if(choice === 1) {
      choice1_elem.querySelector(".thumb-overlay").style.opacity = 0.5;
      choice2_elem.querySelector(".thumb-overlay").style.opacity = 0;
    } else {
      choice2_elem.querySelector(".thumb-overlay").style.opacity = 0.5;
      choice1_elem.querySelector(".thumb-overlay").style.opacity = 0;
    }
  }

  function onNext() {
    console.log(choice);

    choice = -1;
    next_btn.disabled = true;
    choice2_elem.querySelector(".thumb-overlay").style.opacity = 0;
    choice1_elem.querySelector(".thumb-overlay").style.opacity = 0;
  }
  
  const choice1_elem = document.querySelector("#choice1");
  choice1_elem.querySelector(".thumb").addEventListener("click", (e) => {
    e.preventDefault();
    onSetChoice(1);
  });

  const choice2_elem = document.querySelector("#choice2");
  choice2_elem.querySelector(".thumb").addEventListener("click", (e) => {
    e.preventDefault();
    onSetChoice(2);
  });

  const next_btn = document.querySelector("#next-button");
  next_btn.addEventListener("click", (e) => {
    e.preventDefault();
    onNext();
  });
}