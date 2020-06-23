setMaxQuestions = () => {
  let number = document.forms['maxQuestions']['nrQuestions'].value;
  sessionStorage.setItem('MaxQuestions', number);
}
