# [Quiz App with HTML, CSS, and JavaScript.](https://start.opensourceexams.org/)

### Description

<p>I have adapted this quiz app (by @Edgar-K) to accept JSON files generated by Exam Simulator's Exam Maker (https://github.com/exam-simulator). </p> 
  
<p>The current loaded JSON quiz is converted from an existing exam practice PDF file. This Powershell conversion script first converts a PDF to Word, than extracts all the images and saves them separately. Next it extracts all the text paragraph by paragraph, and stores it in a temporary datastructure. Lastly you can export the extracted data to JSON according to the Exam Simulator JSON structure.</p>

<p>I'm currently working to create an open source platform where you can convert, create, import and take practice exams, all free of charge :) The reason I'm setting this up is because I have to study regularly for various certifications, and I was frustrated with the lack of free practice exam resources (especially since A+ VCE Pro does not work any more ;) ) 
If you're interested in this automatic conversion script, or the project, let me know ;)</p>


-----

### Demo Quiz App 
https://start.opensourceexams.org/

------

### Summary:
* Accepts JSON exam files according to the Exam Simulator JSON Schema (https://exam-simulator.gitbook.io/exam-simulator/schema)
* Loads JSON file from URL
* Save high scores in Local Storage 
* Generates Dynamic HTML
* Randomizes the question order loaded from the JSON exam file
* Works with Multiple Choice and Multiple Answer question types
