const leftData = [
    {
        id: "1",
        text: "Earn",
        match: "c",
        img: "../assets/images/money.png" // Money bag
    },
    {
        id: "2",
        text: "Agree",
        match: "d",
        img: "../assets/images/agree.png" // Thumbs up
    },
    {
        id: "3",
        text: "Favour",
        match: "a",
        img: "../assets/images/help.png" // Helping hand
    },
    {
        id: "4",
        text: "Mason",
        match: "b",
        img: "../assets/images/mcq1-2.png" // House
    },
];

const rightData = [
    {
        match: "a",
        text: "Help",
    },
    {
        match: "b",
        text: "A person who builds houses",
    },
    {
        match: "c",
        text: "Make money",
    },
    {
        match: "d",
        text: "Accept",
    },
];

let selectedLeft = null;
let matchesFound = 0;
let score = 0;
let connections = [];

const leftCol = document.getElementById("leftColumn");
const rightCol = document.getElementById("rightColumn");
const numbersCol = document.getElementById("numbersColumn");
const svg = document.getElementById("line-canvas");
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

function playSound(audioEl) {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => { });
}

function speak(t) {
    speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(t);
    msg.lang = "en-UK";
    msg.volume = 0.25;
    msg.rate = 1;
    msg.pitch = 1;
    speechSynthesis.speak(msg);
}

function smallConfetti() {
    confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.7 },
        scalar: 0.8
    });
}

function init() {
    leftCol.innerHTML = "";
    rightCol.innerHTML = "";
    if (numbersCol) numbersCol.innerHTML = "";

    leftData.forEach((item, index) => {
        // number label aligned with this row
        if (numbersCol) {
            const num = document.createElement("div");
            num.className = "number-item";
            num.textContent = `${index + 1}.`;
            numbersCol.appendChild(num);
        }

        const div = document.createElement("div");
        div.className = "item";
        div.dataset.match = item.match;

        const imgHtml = item.img ? `<img src="${item.img}" class="left-img" onerror="this.style.display='none'" alt="${item.text}">` : "";

        div.innerHTML = `
            ${imgHtml}
            <span>${item.text}</span>
            <span class="dot"></span>
        `;

        div.onclick = () => {
            if (div.classList.contains("matched")) return;

            document
                .querySelectorAll(".left .item")
                .forEach((i) => i.classList.remove("active"));

            div.classList.add("active");
            selectedLeft = div;
        };

        leftCol.appendChild(div);
    });

    rightData.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item";
        div.dataset.id = item.match;

        div.innerHTML = `
            <span class="dot"></span>
            <div class="answer-box"></div>
            <span>${item.text}</span>
        `;

        div.onclick = () => {
            if (!selectedLeft || div.classList.contains("matched")) return;

            if (selectedLeft.dataset.match === div.dataset.id) {
                handleMatch(selectedLeft, div);
            } else {
                // playSound(wrongSound);
                speak("try again");
                div.classList.add("error");
                setTimeout(() => div.classList.remove("error"), 400);
            }
        };

        rightCol.appendChild(div);
    });
}

function handleMatch(leftEl, rightEl) {
    score++;
    playSound(correctSound);

    leftEl.classList.add("matched");
    rightEl.classList.add("matched");
    leftEl.classList.remove("active");

    const imgEl = leftEl.querySelector("img");
    if (imgEl) {
        const img = imgEl.cloneNode(true);
        const box = rightEl.querySelector(".answer-box");
        box.appendChild(img);
    }

    drawCurve(leftEl, rightEl);

    connections.push({ from: leftEl, to: rightEl });

    selectedLeft = null;
    matchesFound++;
    speak("Correct");
    smallConfetti();
    if (matchesFound === leftData.length) {
        setTimeout(showFinal, 700);
    }
}

function drawCurve(el1, el2) {
    const dot1 = el1.querySelector(".dot") || el1;
    const dot2 = el2.querySelector(".dot") || el2;

    const rect1 = dot1.getBoundingClientRect();
    const rect2 = dot2.getBoundingClientRect();
    const containerRect = svg.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - containerRect.left;
    const y1 = rect1.top + rect1.height / 2 - containerRect.top;

    const x2 = rect2.left + rect2.width / 2 - containerRect.left;
    const y2 = rect2.top + rect2.height / 2 - containerRect.top;

    const cx = (x1 + x2) / 2;

    const pathData = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#4B4560");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");

    svg.appendChild(path);
}

function showFinal() {

    document.querySelector(".final-kid-box h2").textContent =
        "🎉 Congratulations!";

    document.getElementById("finalScore").textContent =
        `Your Score: ${score} / ${leftData.length}`;

    document.getElementById("stars").textContent = "⭐".repeat(score);

    document.getElementById("finalPopup").style.display = "flex";

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
    });

    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, 300);
}

window.addEventListener("resize", () => {
    svg.innerHTML = "";
    connections.forEach((c) => drawCurve(c.from, c.to));
});

init();