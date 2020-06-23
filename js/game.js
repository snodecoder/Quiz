const question = document.getElementById('question');
const choices = document.getElementById('choices');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const Max_Questions = sessionStorage.getItem('MaxQuestions'); // Retrieve wanted number of questions
console.log(Max_Questions);

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];


fetch("http://127.0.0.1:5500/70-742.json").then(res => {
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

// HTML template literals
addText = (text) => {
  return `<p class="question">${text}</p>`
}
addImage = (url) => {
  return `<img class="image" src="${url}">`
}
addChoice = (choice) => {
  return `<div class="choice-container"><p class="choice-prefix">${choice.label}</p><p class="choice-text" data-number="${currentQuestion.choices.indexOf(choice)}">${choice.Text}</p></div>`
}

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    //loader
    game.classList.remove('hidden');
    loader.classList.add("hidden");
};



incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}



getNewQuestion = () => {
    // go to the new page after the answer all questions
    if (availableQuestions.length === 0 || questionCounter >= Max_Questions) {
        localStorage.setItem("mostRecentScore", score);
        // go to the end of page
        return window.location.assign("end.html")
    }

    questionCounter++;
    var htmlMarkup = ""

    //Update the progress Bar
    progressText.innerText = `Question ${questionCounter}/${Max_Questions}`;
    progressBarFull.style.width = ` ${(questionCounter / Max_Questions) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    // Map content of question to HTML structure
    currentQuestion.question.forEach(questionPart => {
      if (questionPart.variant == 1) { // if Text
        //question.insertAdjacentHTML("beforeend", `<p class="question">${questionPart.text}</p>`)
        htmlMarkup += `<p class="question">${questionPart.text}</p>`
      }
      else if (questionPart.variant == 0) { // if Images
        //question.insertAdjacentHTML("beforeend", `<img class="image" src="${questionPart.text}">`)
        htmlMarkup += `<img class="image" src="${questionPart.text}">`
      }
    });
    // Map content of available question choices to HTML structure
    currentQuestion.choices.forEach(choice => {
      htmlMarkup += addChoice(choice)
    });

    // Add submit button
    htmlMarkup += `<div id="submit"><p id="submit_btn" class="btn">Submit</p></div>`
    question.innerHTML = htmlMarkup;
    acceptingAnswers = true;


};


document.addEventListener('click', function(e) {
  const chosenClass = "chosen"
    if (e.target && e.target.classList == 'choice-text'){ // User chooses answer
      if (!acceptingAnswers) return;


      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
      const hasClass = selectedChoice.parentElement.classList.contains(chosenClass);

      // Remove ClassToApply when clicked again
      if (hasClass) {
        selectedChoice.parentElement.classList.remove(chosenClass);
      }
      // Add ClassToApply when empty
      else if (!hasClass) {

        // If Multiple Choice Single Answer, delete other chosen answer when Class already present
        if (currentQuestion.variant == 0) {
          const results = question.getElementsByClassName(chosenClass);

          if (results) {
            for ($i=0; $i < results.length; $i++) {
              results[$i].classList.remove(chosenClass);
            }
          }
          selectedChoice.parentElement.classList.add(chosenClass);
        }
      }
    }
    else if (e.target && e.target.id == 'submit_btn') { // User submits answers

      var givenAnswers = []
      const results = question.getElementsByClassName(chosenClass); // get the chosen User answers

      // If multiple choice (single answer)
      if (currentQuestion.variant == 0) {
        givenAnswers += results[0].childNodes[1].dataset.number

        // Check answer
        if (currentQuestion.answer[givenAnswers[0]] == true) {
          classToApply = 'correct'
          correct = true;
        }
        else if (currentQuestion.answer[givenAnswers[0]] == false) {
          classToApply = 'incorrect'
        }
        results[0].classList.add(classToApply);
        results[0].classList.remove(chosenClass);

      }

      // if multiple choice (multiple answer)
      else if (currentQuestion.variant == 1) {
        results.forEach(result => {
          givenAnswers += result.childNodes[1].dataset.number

          givenAnswers.forEach(answer => {
            if (currentQuestion.answer[answer] == true) {
              classToApply = 'correct'
              correct = true;
            }
            else if (currentQuestion.answer[answer] == false) {
              classToApply = 'incorrect'
            }
          })
          result.classList.add(classToApply)
          result.classList.remove(chosenClass)
        });
      }
      const incorrect = question.getElementsByClassName('incorrect'); // get the chosen User answers

      if (incorrect.length == 0) {
        incrementScore(Correct_Bonus);
      }

      // Show Explanation
      currentQuestion.explanation.forEach(part => {
        question.innerHTML += addText(part.text)
      })

      setTimeout(() => {
        getNewQuestion();
      }, 4000);

    } // End submit button
});




/*


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



*/