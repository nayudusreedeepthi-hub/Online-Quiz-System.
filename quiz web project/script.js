// ===============================
// QUIZ DATA
// ===============================

const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },

    {
        question: "Which language is used to style a web page?",
        options: [
            "HTML",
            "CSS",
            "Java",
            "Python"
        ],
        answer: 1
    },

    {
        question: "Which language is mainly used to add interactivity to websites?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        answer: 2
    },

    {
        question: "Which HTML tag is used to create a hyperlink?",
        options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
        ],
        answer: 1
    },

    {
        question: "Which CSS property is used to change text color?",
        options: [
            "font-color",
            "text-color",
            "color",
            "foreground"
        ],
        answer: 2
    }
];


// ===============================
// VARIABLES
// ===============================

let currentQuestion = 0;
let selectedAnswers = [];
let score = 0;

let timeLeft = 300;
let timerInterval;


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


// ===============================
// REGISTER
// ===============================

document.getElementById("registerForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    localStorage.setItem("quizUser", JSON.stringify({
        name,
        email,
        password
    }));

    alert("Account created successfully!");

    showPage("loginPage");
});


// ===============================
// LOGIN
// ===============================

document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem("quizUser"));

    if (user && user.email === email && user.password === password) {

        document.getElementById("welcomeUser").textContent =
            "Hi, " + user.name;

        showPage("dashboardPage");

    } else {

        alert("Invalid email or password.");

    }

});


// ===============================
// LOGOUT
// ===============================

function logout() {

    showPage("loginPage");

}


// ===============================
// START QUIZ
// ===============================

function startQuiz() {

    currentQuestion = 0;
    selectedAnswers = [];
    score = 0;

    timeLeft = 300;

    clearInterval(timerInterval);

    showPage("quizPage");

    startTimer();

    displayQuestion();

}


// ===============================
// DISPLAY QUESTION
// ===============================

function displayQuestion() {

    const question = questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("questionText").textContent =
        question.question;

    const optionsContainer =
        document.getElementById("optionsContainer");

    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {

        const div = document.createElement("div");

        div.classList.add("option");

        div.textContent = option;

        if (selectedAnswers[currentQuestion] === index) {
            div.classList.add("selected");
        }

        div.onclick = function() {

            selectedAnswers[currentQuestion] = index;

            document.querySelectorAll(".option").forEach(item => {
                item.classList.remove("selected");
            });

            div.classList.add("selected");

        };

        optionsContainer.appendChild(div);

    });


    // Progress bar

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";


    // Previous button

    document.getElementById("previousBtn").style.visibility =
        currentQuestion === 0 ? "hidden" : "visible";


    // Last question

    if (currentQuestion === questions.length - 1) {

        document.getElementById("nextBtn").textContent =
            "Submit Quiz";

    } else {

        document.getElementById("nextBtn").textContent =
            "Next →";

    }

}


// ===============================
// NEXT QUESTION
// ===============================

function nextQuestion() {

    if (selectedAnswers[currentQuestion] === undefined) {

        alert("Please select an answer.");

        return;
    }


    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        displayQuestion();

    } else {

        finishQuiz();

    }

}


// ===============================
// PREVIOUS QUESTION
// ===============================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        displayQuestion();

    }

}


// ===============================
// TIMER
// ===============================

function startTimer() {

    updateTimer();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            finishQuiz();

        }

    }, 1000);

}


function updateTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    document.getElementById("timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// ===============================
// FINISH QUIZ
// ===============================

function finishQuiz() {

    clearInterval(timerInterval);

    score = 0;

    questions.forEach((question, index) => {

        if (selectedAnswers[index] === question.answer) {

            score++;

        }

    });


    const percentage =
        Math.round((score / questions.length) * 100);


    document.getElementById("finalScore").textContent =
        percentage + "%";

    document.getElementById("correctAnswers").textContent =
        score;

    document.getElementById("wrongAnswers").textContent =
        questions.length - score;


    if (percentage === 100) {

        document.getElementById("scoreMessage").textContent =
            "Perfect Score! 🎉";

    } else if (percentage >= 60) {

        document.getElementById("scoreMessage").textContent =
            "Great Job! 👏";

    } else {

        document.getElementById("scoreMessage").textContent =
            "Keep Practicing! 💪";

    }


    saveResult(percentage);

    showPage("resultPage");

}


// ===============================
// SAVE RESULT
// ===============================

function saveResult(percentage) {

    let results =
        JSON.parse(localStorage.getItem("quizResults")) || [];

    results.push({
        score: percentage,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "quizResults",
        JSON.stringify(results)
    );

    updateDashboardStats();

}


// ===============================
// DASHBOARD STATISTICS
// ===============================

function updateDashboardStats() {

    const results =
        JSON.parse(localStorage.getItem("quizResults")) || [];

    document.getElementById("quizCount").textContent =
        results.length;

    if (results.length > 0) {

        const best =
            Math.max(...results.map(result => result.score));

        document.getElementById("bestScore").textContent =
            best + "%";

    }

}


// ===============================
// LEADERBOARD
// ===============================

function showLeaderboard() {

    showPage("leaderboardPage");

}


// ===============================
// INITIALIZE
// ===============================

updateDashboardStats();
showPage("loginPage");