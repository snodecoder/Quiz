const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];



highScoresList.innerHTML = highScores.map(score => {
    return `<li class="high-score">User: ${score.name} | Score: ${score.score}% | Questions: ${score.questions}</li>`;}).join('');



