const question = document.getElementById('question');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const hud = document.getElementById('hud');
const url_prod = 'https://start.opensourceexams.org/exams/70-742/70-742.json';
const url_dev = 'http://127.0.0.1:5500/70-742.json';
const delayTime = 4000;

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
let exam = [];

// Change URL HERE //
fetch(url_dev).then(res => {
    return res.json();

}).then(loadedExam => {
    console.log('Exam loaded');
    exam = loadedExam
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
const Max_Questions = sessionStorage.getItem('NumberOfQuestions'); // Retrieve wanted number of questions
console.log(Max_Questions);

// HTML template literals
addText = (text) => {
  return `<p class="text">${text}</p>`
}
addImage = (url) => {
  return `<img class="image" src="${url}">`
}
addChoice = (choice) => {
  return `<div class="choice-container"><p class="choice-prefix">${choice.label}</p><p class="choice-text" data-number="${currentQuestion.choices.indexOf(choice)}">${choice.Text}</p></div>`
}
addLink = (url) => {
  return `<a class="text" target="_blank" rel="noopener" href="${url}">${url}</a>`
}

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    //loader
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    hud.insertAdjacentHTML('beforebegin', `<h2 class="title">${exam.title}</h2>`)
};




getNewQuestion = () => {
    // go to the new page after the answer all questions
    if (availableQuestions.length === 0 || questionCounter >= Max_Questions) {
        localStorage.setItem('mostRecentScore', score);
        // go to the end of page
        return window.location.assign('end.html')
    }

    questionCounter++;
    var htmlMarkup = ''

    //Update the progress Bar
    progressText.innerText = `Question ${questionCounter}/${Max_Questions}`;
    progressBarFull.style.width = ` ${(questionCounter / Max_Questions) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    // Map content of question to HTML structure
    currentQuestion.question.forEach(questionPart => {
      if (questionPart.variant == 1) { // if Text
        htmlMarkup += `<p class="question">${questionPart.text}</p>`
      }
      else if (questionPart.variant == 0) { // if Images
        htmlMarkup += `<img class="image" src="${questionPart.text}">`
      }
    });
    // Insert statement about type of question, and type of required answers.
    switch (currentQuestion.variant) {
      case 0:
        htmlMarkup += `<h4 class="question">Choose the correct answer.</h4>`
        break;
      case 1:
        htmlMarkup += `<h4 class="question">Choose all the answers that are correct.</h4>`
        break;
      default:
        break;
    }

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
  const chosenClass = 'chosen';

    if (e.target && e.target.classList == 'choice-text'){ // User chooses answer
      if (!acceptingAnswers) return;

      const selectedChoice = e.target;
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
        }
        selectedChoice.parentElement.classList.add(chosenClass);
      }
    }
    else if (e.target && e.target.id == 'submit_btn') { // User submits answers
      acceptingAnswers = false
      var classToApply = new String
      var results = question.getElementsByClassName(chosenClass); // get the chosen User answers

      // If multiple choice (single answer)
      if (currentQuestion.variant == 0) {
        const answer = results[0].childNodes[1].dataset.number

        // Check answer
        if (currentQuestion.answer[answer] == true) {
          classToApply = 'correct'
          correct = true;
        }
        else if (currentQuestion.answer[answer] == false) {
          classToApply = 'incorrect'
        }
        results[0].classList.add(classToApply);
      }

      // if multiple choice (multiple answer)
      else if (currentQuestion.variant == 1) {
        for ($i=0; $i < results.length; $i++) {
          const answer = results[$i].lastChild.dataset.number

            if (currentQuestion.answer[answer] == true) {
              classToApply = 'correct';
              correct = true;
            }
            else if (currentQuestion.answer[answer] == false) {
              classToApply = 'incorrect';
            }
            console.log(classToApply)
          results[$i].classList.add(classToApply);
        }
      }
      var incorrect = question.getElementsByClassName('incorrect'); // get the chosen User answers

      if (incorrect.length == 0) {
        incrementScore(Correct_Bonus);
      }

      // Show Explanation
			if (currentQuestion.explanation == null) {
				question.innerHTML += addText("No explanation present.")
      }
      else {
        for (let i = 0; i < currentQuestion.explanation.length; i++) {
          if (currentQuestion.explanation[i].text.includes('http')) {
            question.innerHTML += addLink(currentQuestion.explanation[i].text)
          }
          else {
            question.innerHTML += addText(currentQuestion.explanation[i].text)
          }
        }

      }

      const submitButton = document.getElementById('submit_btn')
      submitButton.innerHTML = 'Next'
      submitButton.id = 'next_btn'
    } // End submit button
    else if (e.target && e.target.id == 'next_btn') { // Next question
      getNewQuestion();
    }


});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}
