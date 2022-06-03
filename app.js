const Text = document.querySelector(".text p"),
  input = document.querySelector(".container .input-field"),
  time = document.querySelector(".time span b"),
  Mistakes = document.querySelector(".mistakes span"),
  WPM = document.querySelector(".WPM span"),
  CMP = document.querySelector(".CPM span"),
  tryAgain = document.querySelector(".content button");
let timer,
  maxTime = 60,
  timeLeft = maxTime,
  charIndex = (Flag = Mistake = 0);
//============Request function ( Json file )=============//
function readTextFile(file, callback) {
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", file, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == "200") {
      callback(xhr.responseText);
    }
  };
  xhr.send(null);
}
//====Usage the function pass the file and call back Response text====//
readTextFile("./paragraphs.json", function (resText) {
  let paragraphs = JSON.parse(resText);
  function randomParagraph() {
    //Getting random index from the array
    let randomIndex = Math.floor(Math.random() * paragraphs.length);
    Text.innerHTML = "";
    //spilt the pargraph in random index into characters "then looping on them and make them in spans"
    paragraphs[randomIndex].split("").forEach((span) => {
      let spanTag = `<span>${span}</span>`;
      Text.innerHTML += spanTag;
    });
    //==== Use a hidden input for compare typed charcters============//
    charcters = Text.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => input.focus());
    Text.addEventListener("click", () => input.focus());
  }
  function initTyping() {
    const charcters = Text.querySelectorAll("span");
    let typedChar = input.value.split("")[charIndex];
    if (charIndex < charcters.length - 1 && timeLeft > 0) {
      if (!Flag) {
        timer = setInterval(initTimer, 1000);
        Flag = true;
      }
      //==========validate Typed char==========//
      if (typedChar == null) {
        charIndex--;
        charcters[charIndex].classList.remove("correct", "incorrect");
        Mistake > 0 ? Mistake-- : 0;
      } else {
        if (charcters[charIndex].innerText === typedChar) {
          charcters[charIndex].classList.add("correct");
        } else {
          Mistake++;
          charcters[charIndex].classList.add("incorrect");
        }
        charIndex++;
      }
      charcters.forEach((span) => {
        span.classList.remove("active");
      });
      Mistakes.innerHTML = Mistake;
      charcters[charIndex].classList.add("active");
      CMP.innerText = charIndex - Mistake;
      let wpm = Math.round(
        ((charIndex - Mistake) / 5 / (maxTime - timeLeft)) * 60
      );
      Wpm = wpm < 0 || !wpm === Infinity ? 0 : wpm;
      WPM.innerHTML = wpm;
    } else {
      input.value = "";
      clearInterval(timer);
    }
  }
  function initTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      time.innerHTML = timeLeft;
    } else {
      clearInterval(timer);
    }
    timeLeft > 15
      ? document.querySelector(".time p i").classList.remove("hurry")
      : document.querySelector(".time p i").classList.add("hurry");
  }
  function resetGame() {
    randomParagraph();
    timeLeft = maxTime;
    charIndex = Flag = Mistake = 0;
    time.innerHTML = timeLeft;
    Mistakes.innerHTML = Mistake;
    WPM.innerHTML = 0;
    CMP.innerText = 0;
    input.value = "";
    clearInterval(timer);
    document.querySelector(".time p i").classList.remove("hurry");
  }
  tryAgain.addEventListener("click", resetGame);
  input.addEventListener("input", initTyping);
  randomParagraph();
});
