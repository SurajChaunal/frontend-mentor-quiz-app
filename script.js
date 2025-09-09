const introOptionsContainerEl = document.querySelector(".options--subject");
const introSectionContainer = document.querySelector(".intro--section");
let quizSectionContainer = document.querySelector(".quiz--section");
const finalSectionContainer = document.querySelector(".final--section");
const headerInfoEl = document.querySelector(".header--info");
const headerTitleEl = document.querySelector(".header-title");
const headerIconEl = document.querySelector(".header-icon");
const optionsContainerEl = document.querySelector(".options-question");
const titleSectionContainer = document.querySelector(".title-section-quiz");
const scoreDisplayContainer = document.querySelector(".score-display");
const headerSubjectContainer = document.querySelector(".header-subject");
const submitBtn = document.querySelector(".btn--submit");
const againBtn = document.querySelector(".btn--again");
const errorEl = document.querySelector(".error-msg");

//state variables
let questions,
  length,
  currQuestion,
  currSelected,
  currentInd = 0,
  currentSubject = "",
  totalScore = 0;

function setHeaderInfo(subject) {
  headerInfoEl.style.display = "flex";
  headerTitleEl.textContent = subject;
  headerIconEl.src = `./images/icon-${subject}.svg`;
  headerIconEl.classList.add(`icon--${subject}`);
}
async function extractQuestions(subject) {
  const res = await fetch("./data.json");
  const data = await res.json();
  questions = data.quizzes.find(
    (subjectObj) => subjectObj.title === subject
  ).questions;
}
function setButtonActive(targetBtn) {
  const options = document.querySelectorAll(".btn");
  options.forEach((btn) => btn.classList.remove("active"));
  targetBtn.classList.add("active");
  currSelected = targetBtn;
  // console.log(currSelected);
}

function showScoreUI() {
  quizSectionContainer.classList.remove("active");
  finalSectionContainer.classList.add("active");

  scoreDisplayContainer.innerHTML = `    
        <div class='subject--info'>
        <img src="./images/icon-${currentSubject}.svg"
          alt="icon"
          class="header-icon"
          />
          <span class="subject-title">${currentSubject}</span>
          </div>
          <h1 class="final-score">${totalScore}</h1>
          <h3 class="secondary-heading">Out of 100</h3>`;
}

function nextQuestion() {
  currentInd++;
  if (currentInd === length) {
    showScoreUI();
    return;
  }
  setQuestion(currentInd);
}

function handleAnswer(e) {
  // console.log("clicked");
  if (!e.target.closest(".btn")) return;
  setButtonActive(e.target.closest(".btn"));
}

function setQuestion(number) {
  currQuestion = questions.at(number - 1);
  let titlehtml = `
      <p class="secondary-heading">Question ${number + 1} out of ${length}</p>
      <h1 class="section-header">${currQuestion.question}</h1>
      <progress class="progress-bar" max=${length} value=${
    number + 1
  }></progress>
      `;
  titleSectionContainer.innerHTML = "";
  titleSectionContainer.insertAdjacentHTML("afterbegin", titlehtml);

  optionsContainerEl.innerHTML = "";
  console.log(currQuestion);
  let optionHtml;
  for (i = 0; i < 4; i++) {
    const btn = document.createElement("button");
    btn.className = "btn";

    const optNum = document.createElement("span");
    optNum.className = "option-number";
    optNum.textContent = String.fromCharCode(65 + i);

    const optText = document.createElement("span");
    optText.className = "option-text";
    optText.textContent = currQuestion.options[i]; // safe — shows tags as text

    const imageHtml = `<span class="option-result">
         <img src="./images/icon-correct.svg" class
           ="correct-icon"/>
           <img src="./images/icon-error.svg" class="error-icon"/>
           </span>`;
    btn.append(optNum, optText);
    btn.insertAdjacentHTML("beforeend", imageHtml);
    optionsContainerEl.appendChild(btn);
  }
  // optionsContainerEl.addEventListener();
}

function handleSubmit(e) {
  if (e.target.textContent.trim() === "Next Question") {
    e.target.textContent = "Submit Answer";
    nextQuestion();
    return;
  }
  if (!currSelected) {
    errorEl.classList.add("active");
    return;
  }

  const currAnswer = currSelected
    .querySelector(".option-text")
    .textContent.trim();
  if (currQuestion.answer === currAnswer) {
    currSelected.classList.add("success");
    totalScore += 10;
  } else currSelected.classList.add("error");
  submitBtn.textContent = "Next Question";
  currSelected = "";
  errorEl.classList.remove("active");
}

async function startQuiz(e) {
  if (!e.target.classList.contains("btn")) return;
  currentSubject = e.target.dataset.subject;
  await extractQuestions(currentSubject);
  length = questions.length;

  introSectionContainer.classList.remove("active");
  quizSectionContainer.classList.add("active");
  // headerSubjectContainer.style.opacity = 1;
  setQuestion(currentInd);
}
function playAgain() {
  finalSectionContainer.classList.remove("active");
  introSectionContainer.classList.add("active");
  submitBtn.textContent = "Submit Answer";
  totalScore = 0;
  currentInd = 0;
  currSelected = "";
}

introOptionsContainerEl.addEventListener("click", startQuiz);
optionsContainerEl.addEventListener("click", handleAnswer);
submitBtn.addEventListener("click", handleSubmit);
againBtn.addEventListener("click", playAgain);
