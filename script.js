
// navgiate betweeen tabs
document.addEventListener('DOMContentLoaded', function () {
    displayParticipantsTable();
    populateProgressTable();
    displayQuestionsTable();
    storeCompetitionDetails();
    openPopup('add-participant-popup', 'open-popup-btn', '.close');
    openPopup('add-questions-popup','open-popup-btn-question','.close');
    
    const tabs = document.querySelectorAll('.sidebar-nav ul li a');
    const contents = document.querySelectorAll('.tab-content');

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
        startCompetitionTimer('advanced-timer', 'advanced');
    });

     document.getElementById("toggle-beginner").addEventListener('click', function () {
        startCompetitionTimer('beginner-timer', 'beginner');
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
        correctAnswer: 0,
        incorrectAnswer:0,
        totalTime: 0
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
    populateProgressTable();
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
            <td><i class="fa-solid fa-user-pen edit-question-icon" data-index="${index}" style="cursor: pointer;"></i></td>
            <td><i class="fa-solid fa-user-slash delete-question-icon" data-index="${index}" style="cursor: pointer;"></i></td>
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


// display progress table
function populateProgressTable() {
    var participants = getParticipants();
    var tbody = document.querySelector('#track-progress tbody');

    tbody.innerHTML = '';
    participants.forEach(function(participant) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.name}</td>
            <td>${participant.correctAnswer}</td>
            <td>${participant.incorrectAnswer}</td>
            <td>${participant.totalTime}</td>
        `;
        tbody.appendChild(row);
    });
}


// store Competition Details
function storeCompetitionDetails() {
    var form = document.getElementById('competition-details-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var competitionTitle = document.getElementById('competition-title').value;
        var competitionDescription = document.getElementById('competition-description').value;
        var prizes = document.getElementById('prizes').value;
        var duration = document.getElementById('duration-hours').value;
        var numberOfQuestions = document.getElementById('number-of-questions').value;
        var competitionLevel = document.querySelector('#competition-details-form select').value;

        var competitionDetails = {
            title: competitionTitle,
            description: competitionDescription,
            prizes: prizes,
            numberOfQuestions: numberOfQuestions,
            duration: duration,
            state: false,
        };

        localStorage.setItem('competitionDetails_'+competitionLevel , JSON.stringify(competitionDetails));
        alert('Competition details saved successfully!');
    });
}
// display Competition Details form
function displayCompetitionDetails() {
    var competitionLevel = document.querySelector('#competition-details-form select').value;
    if (competitionLevel) {
        var existingDetails = localStorage.getItem('competitionDetails_' + competitionLevel);
        if (existingDetails) {
            var competitionDetails = JSON.parse(existingDetails);
            document.getElementById('competition-title').value = competitionDetails.title;
            document.getElementById('competition-description').value = competitionDetails.description;
            document.getElementById('prizes').value = competitionDetails.prizes;
            document.getElementById('number-of-questions').value = competitionDetails.numberOfQuestions;
            document.getElementById('duration-hours').value = competitionDetails.duration;
        } else {
            document.getElementById('competition-details-form').reset();
        }
    }
}
document.querySelector('#competition-details-form select').addEventListener('change', displayCompetitionDetails);


// start competition 
function startCompetitionTimer(timerId, level) {
    const timerDisplay = document.getElementById(timerId);
    var existingDetails = localStorage.getItem('competitionDetails_' + level);
    var competitionDetails = JSON.parse(existingDetails);
    var durationHours = competitionDetails.duration;
    var totalSeconds = durationHours * 3600;

    var startDate = new Date(); 
    var endDate = new Date(startDate.getTime() + totalSeconds *1000).toLocaleString();
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
}









