const question = document.getElementById("question");
const images = document.getElementById("images");
const explanation = document.getElementById("explanation");
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("http://localhost:5500/70-742.json").then(res => {
    return res.json();

}).then(loadedExam => {
    console.log(loadedExam);

    questions = loadedExam.test.map(loadedQuestion => {
      const formattedQuestion = {
          variant: loadedQuestion.variant  
          ,question: loadedQuestion.question
          ,choices: loadedQuestion.choices
          ,answer: loadedQuestion.answer
          ,explanation: loadedQuestion.explanation
      };
      return formattedQuestion;
    })
    
    startGame();
}).catch(err => {
    console.log(err);
});

// Constants
const Correct_Bonus = 1;
const Max_Questions = 50;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    //loader
    game.classList.remove('hidden');
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    // go to the new page after the answer all questions
    if (availableQuestions.length === 0 || questionCounter >= Max_Questions) {
        localStorage.setItem("mostRecentScore", score);
        // go to the end of page
        return window.location.assign("end.html")
    }

    questionCounter++;

    //Update the progress Bar
    progressText.innerText = `Question ${questionCounter}/${Max_Questions}`;
    progressBarFull.style.width = ` ${(questionCounter / Max_Questions) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    // Map content of question to HTML structure
    currentQuestion.question.forEach(questionPart => {
      if (questionPart.variant == 1) { // if Text 
        question.insertAdjacentHTML("beforeend", "<p class='question'>" + questionPart.text + "</p>")
      }
      else if (questionPart.variant == 0) { // if Images
        question.insertAdjacentHTML("beforeend", "<img class='image' src='" + questionPart.text + "'>")
      }
    });

    // Map content of available question choices to HTML structure
    currentQuestion.choices.forEach(choice => {
      question.insertAdjacentHTML("beforeend", `<div class="choice-container"><p class="choice-prefix">${choice.label}</p><p class="choice-text"  data-number="${currentQuestion.choices.indexOf(choice)}">${choice.Text}</p></div>`
      )
    })
    acceptingAnswers = true;


};

resetListener = () => {

  var correctAnswers = []
  document.addEventListener('click', function(e){
    if (e.target && e.target.classList == 'choice-text'){
      if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        
        for($i = 0; $i < currentQuestion.answer.length; $i++) {
          if (currentQuestion.answer[$i] == true) {
            correctAnswers += $i
          }
        }
        
        //currentQuestion.answer.forEach(option => { 
        if (currentQuestion.answer[selectedAnswer] == true) {
          const classToApply = 'correct'
        }
        //const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === "correct") {
            incrementScore(Correct_Bonus);
        }

        selectedChoice.parentElement.classList.add(classToApply);
  /*
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);*/
    }
  })
}

/*
var choices = Array.from(document.getElementsByClassName('choice-text'));
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === "correct") {
            incrementScore(Correct_Bonus);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;

}

*/