let questionsArray = [
  {
    question: "wewqe",
    corrcetAnswer: "2",
    level: "advanced",
    options: [11, 11, 11, 11],
  },
  {
    question: "2455",
    corrcetAnswer: "8",
    level: "advanced",
    options: [2, 8, 8, 8],
  },
  {
    question: "21323",
    corrcetAnswer: "344",
    level: "beginner",
    options: [333, 33, 33, 33],
  },
];

localStorage.setItem("questions", JSON.stringify(questionsArray));

let questions = JSON.parse(localStorage.getItem("questions")) || [];

// Identiyfiy The Elements

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

// *************************************************************************************************************

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

// *************************************************************************************************************
// set inital Value
if (count < questions.length) {
  QuestionText.innerHTML = questions[0].question;
  for (let i = 0; i < ListAnswers.length; i++) {
    ListAnswers[i].innerHTML = questions[0].options[i];
  }
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
    if (count != questions.length - 1) {
      cleartimerOfQuestion();
      console.log(questionsTimes);
      s = 0;
      m = 0;
      h = 0;
      startIntervalForEveryQuestion();
    } else {
      questionsTimes[count] = `${h}:${m}:${s}`;
      console.log(questionsTimes);
    }

    if (count != questions.length - 1) {
      console.log(count + " " + theNumberOfAnswer);
      console.log(questions[count].options[theNumberOfAnswer]);
    }

    count++;
    restBackGroundAnswers();
    button.classList.remove("active");

    if (count < questions.length) {
      QuestionText.innerHTML = questions[count].question;
      for (let i = 0; i < ListAnswers.length; i++) {
        ListAnswers[i].innerHTML = questions[count].options[i];
      }
      answred = false;

      // here to save answers
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Your answers will be submited!",
        icon: "success",
        showCancelButton: true,
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
          cleartimerOfQuestion();
          timerHandler();
          console.log(totalTime);
          let questionPage = document.getElementById("question");
          //   questionPage.style.display = "none";
          setTimeout(() => {
            // location.href =
            //   "http://127.0.0.1:5500/assets/DetailsPage/detailsPage.html";
          }, 2000);
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
let minute = 1;
let hour = 0;
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
              location.href =
                "http://127.0.0.1:5500/assets/DetailsPage/detailsPage.html";
            }, 2000);
          }
        });
      }
    }
  }
}, 10);

function timerHandler() {
  clearInterval(timer);
  totalTime = `${hour}:${minute}:${second}`;
}

// Questions Times
