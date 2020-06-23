setMaxQuestions = () => {
  let number = document.forms['maxQuestions']['nrQuestions'].value;
  sessionStorage.setItem('NumberOfQuestions', number);
}