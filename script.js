/* =====================================================
   CAREERAI JAVASCRIPT
===================================================== */


/* =====================================================
   API CONFIGURATION
===================================================== */

const API_URL = "https://career-ai-chatbot-xskh.onrender.com";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const messages =
    document.getElementById("messages");

const chatArea =
    document.getElementById("chatArea");

const welcome =
    document.getElementById("welcome");

const typing =
    document.getElementById("typing");

const clearBtn =
    document.getElementById("clearBtn");

const newChatBtn =
    document.getElementById("newChatBtn");

const historyList =
    document.getElementById("historyList");

const assistantTitle =
    document.getElementById("assistantTitle");

const interviewInfo =
    document.getElementById("interviewInfo");


/* =====================================================
   CURRENT MODE
===================================================== */

let currentMode = "Chat";


/* =====================================================
   MODE NAMES
===================================================== */

const modeTitles = {

    Chat: "CareerAI Assistant",

    Interview: "Python Interview Assistant",

    Resume: "Resume Assistant",

    Code: "Python Code Explainer"

};


/* =====================================================
   SEND MESSAGE
===================================================== */

async function sendMessage(customMessage = null) {


    const message =
        customMessage ||
        messageInput.value.trim();


    /* Empty message */

    if (!message) {

        return;

    }


    /* Hide welcome screen */

    welcome.style.display = "none";


    /* Show interview information */

    if (currentMode === "Interview") {

        interviewInfo.style.display =
            "block";

    }


    /* Add user message */

    addMessage(
        message,
        "user"
    );


    /* Clear textarea */

    messageInput.value = "";

    resetTextarea();


    /* Disable send button */

    sendBtn.disabled = true;


    /* Show typing */

    showTyping();


    try {


        const response = await fetch(

            `${API_URL}/api/chat`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    message: message,

                    mode: currentMode

                })

            }

        );


        const data =
            await response.json();


        /* Hide typing */

        hideTyping();


        /* Enable button */

        sendBtn.disabled = false;


        /* Error response */

        if (!response.ok) {


            addMessage(

                data.error ||
                "Something went wrong.",

                "assistant"

            );


            return;

        }


        /* Add AI response */

        addMessage(

            data.reply,

            "assistant"

        );


        /* Add to history */

        addHistoryItem(message);


    }


    catch (error) {


        hideTyping();


        sendBtn.disabled = false;


        addMessage(

            "Unable to connect to the Python backend. Please make sure Flask server is running.",

            "assistant"

        );


        console.error(
            "API Error:",
            error
        );

    }

}


/* =====================================================
   ADD MESSAGE
===================================================== */

function addMessage(
    text,
    sender
) {


    const messageDiv =
        document.createElement("div");


    messageDiv.className =
        `message ${sender}`;


    /* Avatar */

    const avatar =
        document.createElement("div");


    avatar.className =
        "message-avatar";


    if (sender === "user") {

        avatar.innerHTML =
            '<i class="fa-solid fa-user"></i>';

    }

    else {

        avatar.innerHTML =
            '<i class="fa-solid fa-robot"></i>';

    }


    /* Content */

    const content =
        document.createElement("div");


    content.className =
        "message-content";


    /*
       textContent is used instead of innerHTML
       to prevent unwanted HTML execution.
    */

    content.textContent =
        text;


    messageDiv.appendChild(
        avatar
    );


    messageDiv.appendChild(
        content
    );


    messages.appendChild(
        messageDiv
    );


    scrollToBottom();

}


/* =====================================================
   SHOW TYPING
===================================================== */

function showTyping() {

    typing.style.display =
        "flex";


    scrollToBottom();

}


/* =====================================================
   HIDE TYPING
===================================================== */

function hideTyping() {

    typing.style.display =
        "none";

}


/* =====================================================
   SCROLL CHAT
===================================================== */

function scrollToBottom() {

    setTimeout(
        () => {

            chatArea.scrollTop =
                chatArea.scrollHeight;

        },
        50
    );

}


/* =====================================================
   ADD HISTORY ITEM
===================================================== */

function addHistoryItem(
    text
) {


    const item =
        document.createElement("div");


    item.className =
        "history-item";


    item.textContent =
        text;


    item.title =
        text;


    historyList.prepend(
        item
    );

}


/* =====================================================
   LOAD HISTORY FROM MYSQL
===================================================== */

async function loadHistory() {


    try {


        const response =
            await fetch(
                `${API_URL}/history`
            );


        const data =
            await response.json();


        if (!data.success) {

            return;

        }


        historyList.innerHTML =
            "";


        data.chats.forEach(
            chat => {

                addHistoryItem(
                    chat.user_message
                );

            }
        );


    }


    catch (error) {


        console.error(
            "History Error:",
            error
        );

    }

}


/* =====================================================
   CLEAR CHAT
===================================================== */

async function clearChat() {


    const confirmed =
        confirm(
            "Are you sure you want to clear the chat history?"
        );


    if (!confirmed) {

        return;

    }


    try {


        await fetch(

            `${API_URL}/history`,

            {

                method: "DELETE"

            }

        );


    }


    catch (error) {


        console.error(
            "Clear Error:",
            error
        );

    }


    /* Clear UI */

    messages.innerHTML =
        "";

    historyList.innerHTML =
        "";


    welcome.style.display =
        "block";


    interviewInfo.style.display =
        "none";


    currentMode =
        "Chat";


    updateModeTitle();


    removeActiveButtons();

}


/* =====================================================
   NEW CHAT
===================================================== */

function newChat() {


    messages.innerHTML =
        "";


    welcome.style.display =
        "block";


    interviewInfo.style.display =
        "none";


    currentMode =
        "Chat";


    updateModeTitle();


    removeActiveButtons();


    messageInput.focus();

}


/* =====================================================
   CHANGE MODE
===================================================== */

function changeMode(
    mode
) {


    currentMode =
        mode;


    updateModeTitle();


    /* Remove active class */

    removeActiveButtons();


    /* Find selected button */

    const selectedButton =
        document.querySelector(
            `[data-mode="${mode}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }


    /* Interview UI */

    if (mode === "Interview") {

        interviewInfo.style.display =
            "block";

    }

    else {

        interviewInfo.style.display =
            "none";

    }

}


/* =====================================================
   UPDATE HEADER TITLE
===================================================== */

function updateModeTitle() {


    assistantTitle.textContent =
        modeTitles[currentMode] ||
        "CareerAI Assistant";

}


/* =====================================================
   REMOVE ACTIVE BUTTONS
===================================================== */

function removeActiveButtons() {


    document
        .querySelectorAll(".tool-btn")
        .forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );

}


/* =====================================================
   START INTERVIEW
===================================================== */

function startInterview() {


    changeMode(
        "Interview"
    );


    sendMessage(

        "Start a Python technical mock interview. Ask me one question at a time. After I answer, evaluate my answer, give me a score out of 10, provide feedback, and then ask the next question."

    );

}


/* =====================================================
   RESUME ASSISTANT
===================================================== */

function startResumeAssistant() {


    changeMode(
        "Resume"
    );


    sendMessage(

        "Act as my professional resume assistant. Help me improve my resume for a Python Full Stack Developer fresher role. Ask me for the section I want to improve."

    );

}


/* =====================================================
   CODE EXPLAINER
===================================================== */

function startCodeAssistant() {


    changeMode(
        "Code"
    );


    sendMessage(

        "Act as a Python code reviewer. Ask me to paste my Python code, then explain it, identify errors, and suggest improvements."

    );

}


/* =====================================================
   GENERAL CHAT
===================================================== */

function startGeneralChat() {


    changeMode(
        "Chat"
    );


    messageInput.focus();

}


/* =====================================================
   QUICK PYTHON
===================================================== */

function startPythonLearning() {


    changeMode(
        "Chat"
    );


    sendMessage(

        "Teach me Python in simple language. Start with an important Python concept and give me a practical example."

    );

}


/* =====================================================
   QUICK BUTTONS
===================================================== */

const quickInterview =
    document.getElementById(
        "quickInterview"
    );

const quickResume =
    document.getElementById(
        "quickResume"
    );

const quickPython =
    document.getElementById(
        "quickPython"
    );

const quickCode =
    document.getElementById(
        "quickCode"
    );


if (quickInterview) {

    quickInterview.addEventListener(
        "click",
        startInterview
    );

}


if (quickResume) {

    quickResume.addEventListener(
        "click",
        startResumeAssistant
    );

}


if (quickPython) {

    quickPython.addEventListener(
        "click",
        startPythonLearning
    );

}


if (quickCode) {

    quickCode.addEventListener(
        "click",
        startCodeAssistant
    );

}


/* =====================================================
   SIDEBAR BUTTONS
===================================================== */

const interviewBtn =
    document.getElementById(
        "interviewBtn"
    );

const resumeBtn =
    document.getElementById(
        "resumeBtn"
    );

const codeBtn =
    document.getElementById(
        "codeBtn"
    );

const chatBtn =
    document.getElementById(
        "chatBtn"
    );


if (interviewBtn) {

    interviewBtn.addEventListener(
        "click",
        startInterview
    );

}


if (resumeBtn) {

    resumeBtn.addEventListener(
        "click",
        startResumeAssistant
    );

}


if (codeBtn) {

    codeBtn.addEventListener(
        "click",
        startCodeAssistant
    );

}


if (chatBtn) {

    chatBtn.addEventListener(
        "click",
        startGeneralChat
    );

}


/* =====================================================
   SEND BUTTON
===================================================== */

sendBtn.addEventListener(
    "click",
    () => {

        sendMessage();

    }
);


/* =====================================================
   CLEAR BUTTON
===================================================== */

clearBtn.addEventListener(
    "click",
    clearChat
);


/* =====================================================
   NEW CHAT BUTTON
===================================================== */

newChatBtn.addEventListener(
    "click",
    newChat
);


/* =====================================================
   ENTER KEY
===================================================== */

messageInput.addEventListener(
    "keydown",
    event => {


        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {


            event.preventDefault();


            sendMessage();

        }

    }
);


/* =====================================================
   AUTO RESIZE TEXTAREA
===================================================== */

messageInput.addEventListener(
    "input",
    () => {


        messageInput.style.height =
            "auto";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                130
            ) + "px";

    }
);


/* =====================================================
   RESET TEXTAREA
===================================================== */

function resetTextarea() {

    messageInput.style.height =
        "auto";

}


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        loadHistory();


        messageInput.focus();


        updateModeTitle();

    }
);