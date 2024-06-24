
// navgiate betweeen tabs
document.addEventListener('DOMContentLoaded', function () {
    displayParticipantsTable();
    displayProgressTable();
    displayQuestionsTable();
    displayCompetitionDetails();
    openPopup('add-participant-popup', 'open-popup-btn', '.close');
    openPopup('add-questions-popup','open-popup-btn-question','.close');
    
    const tabs = document.querySelectorAll('.sidebar-nav ul li a');
    const contents = document.querySelectorAll('.tab-content');
    displayCompetitionDetails(); 

    // var quizzesResults=[{"id":"1","name":"ahmad","totalTime":"0:0:1","userLevel":"advanced","answers":[{"question":"2455","selectedAnswer":8,"timeSelectedAnswer":"0:0:1","correct":true},{"question":"2455","selectedAnswer":8,"timeSelectedAnswer":"0:0:1","correct":true}]},{"id":"1","name":"mohammad majed","totalTime":"0:0:1","userLevel":"advanced","answers":[{"question":"2455","selectedAnswer":8,"timeSelectedAnswer":"0:0:1","correct":true},{"question":"2455","selectedAnswer":8,"timeSelectedAnswer":"0:0:1","correct":true}]}]
    // localStorage.setItem('quizzesResults', JSON.stringify(quizzesResults))

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            tabs.forEach(tab => tab.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            contents.forEach(content => content.classList.remove('active'));
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.classList.add('active');
            }
        });
    });

    document.getElementById("toggle-advanced").addEventListener('click', function () {
        startCompetitionTimer('advanced-timer', 'advanced',"toggle-advanced");
    });

     document.getElementById("toggle-beginner").addEventListener('click', function () {
        startCompetitionTimer('beginner-timer', 'beginner',"toggle-beginner");
    });
});

// control popup
function openPopup(popupId, openButtonId, closeButtonSelector ) {
    var popup = document.getElementById(popupId);
    var openPopupButton = document.getElementById(openButtonId);
    var closePopupButton = popup.querySelector(closeButtonSelector);


    function open() {
        popup.style.display = 'block';
    }

    function close() {
        popup.style.display = 'none';
        popup.querySelector('form').reset();
    }

    openPopupButton.addEventListener('click', open);
    closePopupButton.addEventListener('click', close);

    window.addEventListener('click', function(event) {
        if (event.target == popup) {
            close();
            
        }
    });
    return open;
}
function closePopup(popup) {
    var popup = document.getElementById(popup);
    popup.style.display = 'none';
}


var currentEditIndexParticipant = null;
// adding participant
document.getElementById('participant-form').addEventListener('submit', function(event) {
    event.preventDefault();


    var nameInput = document.querySelector('#participant-form input[type="text"][placeholder="Name"]');
    var idInput = document.querySelector('#participant-form input[type="text"][placeholder="User ID"]');
    var selectElement = document.querySelector('#participant-form select');
    var selectedLevel = selectElement.value;

    var participant = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        level: selectedLevel,
    };
    
    var participantsArray = JSON.parse(localStorage.getItem('participants')) || [];

    if (currentEditIndexParticipant !== null) {
        participantsArray[currentEditIndexParticipant] = participant;
    } else {
        participantsArray.push(participant);
    }

    localStorage.setItem('participants', JSON.stringify(participantsArray));

    document.getElementById('participant-form').reset();
    currentEditIndexParticipant = null;
    
    displayParticipantsTable();
    displayProgressTable();
    closePopup('add-participant-popup');
});
// display participant table
function getParticipants(level) {
    var participants = JSON.parse(localStorage.getItem('participants')) || [];
        if (level) {
        return participants.filter(participant => participant.level === level);
    }
    return participants;
}
document.getElementById('participant-level').addEventListener('change', function() {
    var selectedLevel = this.value;
    displayParticipantsTable(selectedLevel);
});
function displayParticipantsTable(level) {
    var participants = getParticipants(level);
    var tbody = document.querySelector('#view-participants tbody');

    tbody.innerHTML = '';
    participants.forEach(function(participant,index) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.level}</td>
            <td>${participant.name}</td>
            <td>${participant.id}</td>
            <td><i class="fa-solid fa-user-pen edit-icon" data-index="${index}" style="cursor: pointer;"></i></td>
            <td><i class="fa-solid fa-user-slash delete-icon" data-index="${index}" style="cursor: pointer;"></i></td>
        `;
        tbody.appendChild(row);
    });
            
            document.querySelectorAll('.edit-icon').forEach(function(editButton) {
        editButton.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            editParticipant(index,level);
            });
        });

    document.querySelectorAll('.delete-icon').forEach(function(deleteButton) {
        deleteButton.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            deleteParticipant(index,level);
            });
        });
}
// edit participant infromation 
function editParticipant(index,level) {
    var participantsArray = JSON.parse(localStorage.getItem('participants')) || [];
    var filteredParticipant = getParticipants(level);
    var participantToEdit = filteredParticipant[index];

    var originalIndex = participantsArray.findIndex(p => p.id === participantToEdit.id);

    if (originalIndex !== -1) {
        var participant = participantsArray[originalIndex];
        var nameInput = document.querySelector('#participant-form input[type="text"][placeholder="Name"]');
        var idInput = document.querySelector('#participant-form input[type="text"][placeholder="User ID"]');
        var selectElement = document.querySelector('#participant-form select');

        nameInput.value = participant.name;
        idInput.value = participant.id;
        selectElement.value = participant.level;

        currentEditIndexParticipant = originalIndex;

        var openAddParticipantPopup = openPopup('add-participant-popup', 'open-popup-btn', '.close');
        openAddParticipantPopup();
}


}
//delete participant 
function deleteParticipant(index,level) {
    var participantsArray = JSON.parse(localStorage.getItem('participants')) || [];
    var filteredParticipant = getParticipants(level);
    var participantToDelete = filteredParticipant[index];

    var originalIndex = participantsArray.findIndex(p => p.id === participantToDelete.id);

    if (originalIndex !== -1) {
        participantsArray.splice(originalIndex, 1);
        localStorage.setItem('participants', JSON.stringify(participantsArray)); 
        displayParticipantsTable();
}}


// add question
var currentEditIndexQuestion = null;
document.getElementById('add-question-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var questionInput = document.querySelector('#add-question-form input[type="text"][placeholder="Question"]');
    var corrcetAnswerInput = document.querySelector('#add-question-form input[type="number"][placeholder="Correct Answer"]');
    var selectElement = document.querySelector('#add-question-form select');
    var selectedLevel = selectElement.value;
        var OptionsInputs = document.querySelectorAll('#add-question-form .options input[type="number"]');
        var OptionsList = [];

        OptionsInputs.forEach(function(input) {
            OptionsList.push(parseFloat(input.value));
        });

    var question = {
        question: questionInput.value.trim(),
        corrcetAnswer: corrcetAnswerInput.value.trim(),
        level: selectedLevel,
        options: OptionsList
    };

    var questionsArray = JSON.parse(localStorage.getItem('questions')) || [];

    if(currentEditIndexQuestion !=null){
        questionsArray[currentEditIndexQuestion] = question;
    }
    else{
        questionsArray.push(question);
    }

    localStorage.setItem('questions', JSON.stringify(questionsArray));
    document.getElementById('add-question-form').reset();
    currentEditIndexQuestion = null;
    displayQuestionsTable();
    closePopup("add-questions-popup");
});
// display question table
function getQuestions(level) {
    var questions = JSON.parse(localStorage.getItem('questions')) || [];
    if (level) {
        return questions.filter(question => question.level === level);
    }
    console.log(questions)
    return questions;
}
document.getElementById('question-level').addEventListener('change', function() {
    var selectedLevel = this.value;
    displayQuestionsTable(selectedLevel);
});
function displayQuestionsTable(level) {
    var questions = getQuestions(level);
    var tbody = document.querySelector('#view-questions tbody');

    tbody.innerHTML = '';
    questions.forEach(function(question,index) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.level}</td>
            <td>${question.question}</td>
            <td>${question.options}</td>
            <td>${question.corrcetAnswer}</td>
            <td><i class="fa-solid fa-pen-to-square edit-question-icon" data-index="${index}" style="cursor: pointer;"></i></td>
            <td><i class="fa-regular fa-square-minus delete-question-icon" data-index="${index}" style="cursor: pointer;"></i></td>
        `;
        tbody.appendChild(row);
    });
                document.querySelectorAll('.edit-question-icon').forEach(function(editButton) {
        editButton.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            editQuestion(index,level);
            });
        });

    document.querySelectorAll('.delete-question-icon').forEach(function(deleteButton) {
        deleteButton.addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            deleteQuestion(index,level);
            });
        });
}
// delete question
function deleteQuestion(index, level) {
    var questions = JSON.parse(localStorage.getItem('questions')) || [];

    var filteredQuestions = getQuestions(level);

    var questionToDelete = filteredQuestions[index];
    var originalIndex = questions.findIndex(q => q.question === questionToDelete.question);

    if (originalIndex !== -1) {
        questions.splice(originalIndex, 1);
        localStorage.setItem('questions', JSON.stringify(questions)); 
        displayQuestionsTable(level); 
}}
// edit question
function editQuestion(filteredIndex, level) {
    var questions = JSON.parse(localStorage.getItem('questions')) || [];

    var filteredQuestions = getQuestions(level);
    
    var questionToEdit = filteredQuestions[filteredIndex];
    var originalIndex = questions.findIndex(q => q.question === questionToEdit.question);

    if (originalIndex !== -1) {
        var question = questions[originalIndex];
        
        var questionInput = document.querySelector('#add-question-form input[type="text"][placeholder="Question"]');
        var correctAnswerInput = document.querySelector('#add-question-form input[type="number"][placeholder="Correct Answer"]');
        var selectElement = document.querySelector('#add-question-form select');
        var optionsInputs = document.querySelectorAll('#add-question-form .options input[type="number"]');

        question.options.forEach((option, index) => {
            if (optionsInputs[index]) { 
                optionsInputs[index].value = option;
            }
        });
        selectElement.value = question.level;
        questionInput.value = question.question;
        correctAnswerInput.value = question.correctAnswer;

        currentEditIndexQuestion = originalIndex;

        var openAddQuestionPopup = openPopup('add-questions-popup', 'open-popup-btn-question', '.close');
        openAddQuestionPopup();
    }
}


function displayProgressTable(level) {
    var quizzesResults = JSON.parse(localStorage.getItem('quizzesResults')) || [];

    const table = document.getElementById('resultsTable');
    const headerRow = document.getElementById('headerRow');
    const tableBody = table.getElementsByTagName('tbody')[0];

    while (headerRow.firstChild) {
        headerRow.removeChild(headerRow.firstChild);
    }

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const filteredResults = quizzesResults.filter(result => !level || result.userLevel === level)
                                          .sort((a, b) => b.correctAnswers - a.correctAnswers);

    const nameHeader = document.createElement('th');
    nameHeader.innerHTML = 'Name';
    headerRow.appendChild(nameHeader);

    const maxQuestions = Math.max(...filteredResults.map(result => result.answers.length));

    for (let i = 0; i < maxQuestions; i++) {
        const th = document.createElement('th');
        th.innerHTML = `Q ${i + 1}`;
        th.classList.add('centered');
        headerRow.appendChild(th);
    }

    const totalTimeHeader = document.createElement('th');
    totalTimeHeader.textContent = 'Total Time';
    totalTimeHeader.classList.add('centered');
    headerRow.appendChild(totalTimeHeader);

    const correctAnswersHeader = document.createElement('th');
    correctAnswersHeader.textContent = 'Correct Answers';
    correctAnswersHeader.classList.add('centered');
    headerRow.appendChild(correctAnswersHeader);

    filteredResults.forEach(result => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = result.name;

        result.answers.forEach((answer, index) => {
            const cell = row.insertCell();
            cell.textContent = answer.timeSelectedAnswer;
            cell.classList.add('centered', answer.correct ? 'correct' : 'incorrect');
        });

        for (let i = result.answers.length; i < maxQuestions; i++) {
            const cell = row.insertCell();
            cell.textContent = 'N/A';
            cell.classList.add('centered');
        }

        const totalTimeCell = row.insertCell();
        totalTimeCell.textContent = result.totalTime;
        totalTimeCell.classList.add('centered');

        const correctAnswersCell = row.insertCell();
        correctAnswersCell.textContent = result.correctAnswers;
        correctAnswersCell.classList.add('centered');
    });
}

levelSelect.addEventListener('change', () => {
            const selectedLevel = levelSelect.value;
            displayProgressTable(selectedLevel);
        });


// store Competition Details
function storeCompetitionDetails() {
    var form = document.getElementById('competition-details-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var competitionTitle = document.getElementById('competition-title').value;
        var competitionDescription = document.getElementById('competition-description').value;
        var duration = document.getElementById('duration-hours').value;
        var numberOfQuestions = document.getElementById('number-of-questions').value;
        var competitionLevel = document.querySelector('#competition-details-form select').value;

        var competitionDetails = {
            title: competitionTitle,
            description: competitionDescription,
            numberOfQuestions: numberOfQuestions,
            duration: duration,
            state: false,
        };

        localStorage.setItem('competitionDetails_'+competitionLevel , JSON.stringify(competitionDetails));
        alert('Competition details saved successfully!');
    });
}
storeCompetitionDetails()
// display Competition Details form
function displayCompetitionDetails() {
    var competitionLevel = document.querySelector('#competition-details-form select').value;
    if (competitionLevel) {
        var existingDetails = localStorage.getItem('competitionDetails_' + competitionLevel);
        if (existingDetails) {
            var competitionDetails = JSON.parse(existingDetails);
            document.getElementById('competition-title').value = competitionDetails.title;
            document.getElementById('competition-description').value = competitionDetails.description;
            document.getElementById('number-of-questions').value = competitionDetails.numberOfQuestions;
            document.getElementById('duration-hours').value = competitionDetails.duration;
         } 
    }
}

document.querySelector('#competition-details-form select').addEventListener('change', displayCompetitionDetails);

// start competition 
function startCompetitionTimer(timerId, level,button) {
  const timerDisplay = document.getElementById(timerId);
    var existingDetails = localStorage.getItem('competitionDetails_' + level);
    var competitionDetails = JSON.parse(existingDetails);
    var button =  document.getElementById(button)
     button.classList.toggle("incorrect");
     button.classList.toggle("incorrect:hover");
     button.innerHTML = "stop";

    if (competitionDetails.state) {
        clearInterval(competitionDetails.interval); 
        competitionDetails.state = false;
        localStorage.setItem('competitionDetails_' + level, JSON.stringify(competitionDetails)); 
        timerDisplay.textContent = "00:00";
        button.innerHTML = "start";
        return;
        
    }

    var durationHours = competitionDetails.duration;
    var totalSeconds = durationHours * 3600;

    var startDate = new Date(); 
    var endDate = new Date(startDate.getTime() + totalSeconds * 1000).toLocaleString();
    competitionDetails.endDate = endDate;
    console.log(endDate);
    competitionDetails.state = true;
    localStorage.setItem('competitionDetails_' + level, JSON.stringify(competitionDetails)); 

    function updateTimer() {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            timerDisplay.textContent = "00:00";
            competitionDetails.state = false;
            localStorage.setItem('competitionDetails_' + level, JSON.stringify(competitionDetails));
            return;
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timerDisplay.textContent = 
            String(hours).padStart(2, '0') + ':' + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');

        totalSeconds--;
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    competitionDetails.interval = interval; // Store interval ID in competitionDetails

    // Update localStorage with the interval ID
    localStorage.setItem('competitionDetails_' + level, JSON.stringify(competitionDetails));
}


document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggle-sidebar");
    const sidebar = document.querySelector(".sidebar-nav");
     const sidebarLinks = document.querySelectorAll(".sidebar-nav a");

    toggleButton.addEventListener("click", function(e) {
        e.preventDefault();
        sidebar.classList.toggle("show");
    });
      sidebarLinks.forEach(link => {
        link.addEventListener("click", function() {
            sidebar.classList.toggle("show");
        });
    })
});








