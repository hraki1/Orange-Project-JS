let participantsArray = JSON.parse(localStorage.getItem("participants")) || [];
let questionsArray = JSON.parse(localStorage.getItem("questions")) || [];
let quizzesResults = JSON.parse(localStorage.getItem("quizzesResults")) || [];

let compotitionAdvance = JSON.parse(
  localStorage.getItem("competitionDetails_advanced")
);
let compotitionBeginner = JSON.parse(
  localStorage.getItem("competitionDetails_beginner")
);


// display none for element
let detailsPage = document.getElementById("detailsPage");
let loginHeader = document.getElementById("login-header");
let loginUserPage = document.getElementById("login-user");
let questionPart = document.getElementById("questionPart");

loginUserPage.classList.add("open");
detailsPage.classList.add("none");
loginHeader.classList.add("none");
questionPart.classList.add("none");

// identifiy elements
let buttonNext = document.getElementById("btn-enter-login-user");
let inputUserID = document.getElementById("enteredUserID");
let btnEnterNickname = document.getElementById("btn-enter-nickname");
let enteredUserNickname = document.getElementById("enteredUserNickname");
let quizzExsistCheck = false;
let participantObj = {
  level: "",
};
let niacknameScreeen = {};

let userLevel = "";
let userIsActive ;
let stateCheck;
let stateSetInterval;
buttonNext.onclick = () => {
  for (let index = 0; index < participantsArray.length; index++) {
    if (participantsArray[index].id == inputUserID.value) {
      if (participantsArray[index].level === "advanced") {
        stateCheck = compotitionAdvance.state;
        // if (compotitionAdvance.state) {
        quizzExsistCheck = true;
        userLevel = participantsArray[index].level;
        userIsActive = participantsArray[index].isActive;
        participantObj = participantsArray[index];
        // }
      } else {
        stateCheck = compotitionBeginner.state;
        // if (compotitionBeginner.state) {
        quizzExsistCheck = true;
        userLevel = participantsArray[index].level;
        userIsActive = participantsArray[index].isActive;
        participantObj = participantsArray[index];
        // }
      }
    }
  }
  if (participantObj.level == "advanced") {
    niacknameScreeen = {
      level: "advanced",
      time: compotitionAdvance.duration,
      numOfQuestion: compotitionAdvance.numberOfQuestions,
    };
  } else {
    niacknameScreeen = {
      level: "beginner",
      time: compotitionBeginner.duration,
      numOfQuestion: compotitionBeginner.numberOfQuestions,
    };
  }

  stateSetInterval = setInterval(() => {
    let compotitionBeginners = JSON.parse(
      localStorage.getItem("competitionDetails_beginner")
    );
    let compotitionAdvances = JSON.parse(
      localStorage.getItem("competitionDetails_advanced")
    );
    console.log(userIsActive)

    if (userLevel === "advanced") {
      if (!compotitionAdvances.state || !userIsActive) {
        stateCheck = false;
      }
    }
    if (userLevel === "beginner") {
      if (!compotitionBeginners.state || !userIsActive) {
        stateCheck = false;
      }
    }

    if (stateCheck === false) {
      Swal.fire({
        icon: "error",
        title: "The Session is stopped",
        text: "Check it and try again! ",
      });
      stopStateSetInterval();
      setTimeout(() => {
        location.reload();
      }, 1700);
    }
  }, 1000);

  function stopStateSetInterval() {
    clearInterval(stateSetInterval);
  }

  let desLevel = document.getElementById("des-level");
  let desTime = document.getElementById("des-time");
  let desNumberOfQuestion = document.getElementById("des-numberOfQuestion");

  desLevel.innerHTML = niacknameScreeen.level;
  desNumberOfQuestion.innerHTML = niacknameScreeen.numOfQuestion;
  desTime.innerHTML = niacknameScreeen.time;

  if (quizzExsistCheck) {
    loginUserPage.classList.add("none");
    detailsPage.classList.add("open");
    loginHeader.classList.add("open");
  } else {
    Swal.fire({
      icon: "error",
      title: "ID is Wrong or Session didn't Start",
      text: "Check it and try again! ",
    });
  }
};

btnEnterNickname.onclick = () => {
  if (enteredUserNickname.value === "") {
    Swal.fire({
      icon: "error",
      title: "Please fill the filed",
    });
  } else {
    loginUserPage.classList.remove("open");
    detailsPage.classList.remove("open");
    loginHeader.classList.remove("open");
    questionPart.classList.remove("none");
    startQuestions();
  }
};

// *************************************************************************************************************

function startQuestions() {
  // Identiyfiy The Elements

  let questions = [];
  let answersOfQuestions = [];
  let questionCount = 1;

  let obj = {
    question: "",
    selectedAnswer: "",
    timeSelectedAnswer: "",
    correct: false,
  };

  let countofquestions = 0;
  for (let index = 0; index < questionsArray.length; index++) {
    if (questionsArray[index].level === userLevel) {
      questions.push(questionsArray[index]);
      countofquestions++;
    }
  }

  let totquestion = document.getElementById("totquestion");
  totquestion.innerHTML = countofquestions;

  let optionOne = document.getElementById("answer-1");
  let optionTwo = document.getElementById("answer-2");
  let optionThree = document.getElementById("answer-3");
  let optionFour = document.getElementById("answer-4");
  let options = [optionOne, optionTwo, optionThree, optionFour];
  let button = document.getElementById("btn-next");
  let QuestionText = document.querySelector(".question .text p");
  let totalTime = "0:0:0";
  let totalTimeComponents = [
    document.getElementById("timer-s"),
    document.getElementById("timer-m"),
    document.getElementById("timer-h"),
  ];
  let ListAnswers = [optionOne, optionTwo, optionThree, optionFour];
  let questionsTimes = [];
  let count = 0;

  for (let index = 0; index < questions.length; index++) {
    questionsTimes.push("0");
  }
  let questionTimeInterval;
  let s = 0;
  let m = 0;
  let h = 0;

  function startIntervalForEveryQuestion() {
    questionTimeInterval = setInterval(() => {
      s++;
      if (s === 60) {
        minute++;
        s = 0;
      } else if (m === 60) {
        h++;
        m = 0;
      }
    }, 1000);
  }

  startIntervalForEveryQuestion();

  function cleartimerOfQuestion() {
    clearInterval(questionTimeInterval);
    questionsTimes[count] = `${h}:${m}:${s}`;
  }

  // set inital Value
  if (count < questions.length) {
    QuestionText.innerHTML = questions[0].question;
    for (let i = 0; i < ListAnswers.length; i++) {
      ListAnswers[i].innerHTML = questions[0].options[i];
    }
    let nfsq = document.getElementById("nfsq");
    nfsq.innerHTML = 1;
  }

  // reset background Answers
  function restBackGroundAnswers() {
    for (let index = 0; index < options.length; index++) {
      options[index].classList.remove("clicked");
    }
  }

  // get the position of the number
  let theNumberOfAnswer;
  let answred = false;
  for (let index = 0; index < options.length; index++) {
    options[index].onclick = () => {
      restBackGroundAnswers();

      theNumberOfAnswer = index;
      answred = true;
      button.classList.add("active");
      options[index].classList.add("clicked");
    };
  }

  // Event Button
  button.onclick = () => {
    if (answred) {
      let objspa = { ...obj };
      if (count != questions.length - 1) {
        cleartimerOfQuestion();
        console.log(questionsTimes);
        console.log(count);
        objspa.timeSelectedAnswer = questionsTimes[count];
        console.log(obj.timeSelectedAnswer +"hello");
        // *********************************************************************
        s = 0;
        m = 0;
        h = 0;
        startIntervalForEveryQuestion();
      } else {
        questionsTimes[count] = `${h}:${m}:${s}`;
        console.log(questionsTimes);
      }

      if (count != questions.length - 1) {
        questionCount++;
        let nfsq = document.getElementById("nfsq");
        nfsq.innerHTML = questionCount;
        console.log(count + " " + theNumberOfAnswer);
        console.log(questions[count].options[theNumberOfAnswer]);
        console.log(questions[count].options[theNumberOfAnswer]);

        objspa.selectedAnswer = questions[count].options[theNumberOfAnswer];
        objspa.question = questions[count].question;
        if (objspa.selectedAnswer == questions[count].corrcetAnswer) {
          objspa.correct = true;
        }
      } else {
        objspa.selectedAnswer = questions[count].options[theNumberOfAnswer];
        objspa.question = questions[count].question;
        if (objspa.selectedAnswer == questions[count].corrcetAnswer) {
          objspa.correct = true;
        }
      }
      objspa.timeSelectedAnswer = questionsTimes[count];
      answersOfQuestions.push(objspa);
      console.log(objspa);
      console.log(answersOfQuestions);
      

      count++;
      restBackGroundAnswers();
      button.classList.remove("active");

      if (count < questions.length) {
        QuestionText.innerHTML = questions[count].question;
        for (let i = 0; i < ListAnswers.length; i++) {
          ListAnswers[i].innerHTML = questions[count].options[i];
        }
        answred = false;
        console.log(obj);

        // here to save answers
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "Your answers will be submited!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Submit all and Finish!",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Submit Success!",
              text: "Your answers has been submited.",
              icon: "success",
            });
            console.log(count - 1 + " " + theNumberOfAnswer);
            console.log(questions[count - 1].options[theNumberOfAnswer]);
            timerHandler();
            console.log(totalTime);
            let numOfCorrectAnswers = 0;
            let numOfq = 0;
            for (let index = 0; index < answersOfQuestions.length; index++) {
              numOfq++;
              if (answersOfQuestions[index].correct === true) {
                numOfCorrectAnswers++;
              }
            }
            console.log(questionTimeInterval+"heeloe")
            let ava = (numOfCorrectAnswers / numOfq) * 100;
            let submittedAnswersObject = {
              id: inputUserID.value,
              name: enteredUserNickname.value,
              totalTime: totalTime,
              userLevel: userLevel,
              NumberOfQuestion: numOfq,
              numberOfCorrectAnswers: numOfCorrectAnswers,
              answers: answersOfQuestions,
              avarage: ava + "%",
              //  timeSelectedAnswer:  questionTimeInterval
            };
            cleartimerOfQuestion();
            quizzesResults.push(submittedAnswersObject);
            localStorage.setItem(
              "quizzesResults",
              JSON.stringify(quizzesResults)
            );
            console.log(submittedAnswersObject);
            console.log(quizzesResults);

            setTimeout(() => {
              location.reload();
            }, 1500);
          } else {
            count--;
          }
        });
      }
    } else {
      Command: toastr["warning"]("You Have Select Answer.");
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
      };
    }
  };

  // Total Time
  let second = 0;
  let minute = 0;
  let hour = 1;
  let timer = setInterval(() => {
    totalTimeComponents[0].innerHTML = second;
    totalTimeComponents[1].innerHTML = minute;
    totalTimeComponents[2].innerHTML = hour;

    if (second != 0) {
      second--;
    } else {
      if (minute != 0) {
        minute--;
        second = 60;
        second++;
      } else {
        if (hour != 0) {
          hour--;
          minute = 59;
          second = 60;
        } else {
          cleartimerOfQuestion();
          timerHandler();
          Swal.fire({
            title: "Quiz time is over",
            text: "You won't be able to complete this quiz!",
            icon: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OKay!",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Submit Success!",
                text: "Your answers has been submited",
                icon: "success",
              });
              setTimeout(() => {
                location.reload();
              }, 1000);
              cleartimerOfQuestion();
              timerHandler();
            }
          });
        }
      }
    }
  }, 1000);

  function timerHandler() {
    clearInterval(timer);

    let calc = hour * 3600 + minute * 60 + second;
    if (userLevel === "advanced") {
      let totalSeconds = compotitionAdvance.duration * 3600 - calc;
      const hours = Math.floor(totalSeconds / 3600);
      const remainingSecondsAfterHours = totalSeconds % 3600;
      const minutes = Math.floor(remainingSecondsAfterHours / 60);
      const seconds = remainingSecondsAfterHours % 60;
      totalTime = `${hours}:${minutes}:${seconds}`;
    } else {
      let totalSeconds = compotitionBeginner.duration * 3600 - calc;
      const hours = Math.floor(totalSeconds / 3600);
      const remainingSecondsAfterHours = totalSeconds % 3600;
      const minutes = Math.floor(remainingSecondsAfterHours / 60);
      const seconds = remainingSecondsAfterHours % 60;
      totalTime = `${hours}:${minutes}:${seconds}`;
    }
  }
}
