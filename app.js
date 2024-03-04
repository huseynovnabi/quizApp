window.addEventListener('load', () => {
    let defaultSoul = 3, index = 0, defaultQuestionCount = 1, passBalance = 5, status = false, clearTime = 500, answerTime = 1000, defaultJockerCount = 10, removeIndex = [];
    let defaultScore = parseInt(localStorage.getItem("score")) || 0;


    const score = document.querySelector('#score');
    const soul = document.querySelector('#soul');
    const questionCount = document.querySelector('#questionCount');
    const questionText = document.querySelector('#questionText');
    const variant = document.querySelectorAll('#variant');
    const pass = document.querySelector('#pass');
    const balance = document.querySelector('#balance');
    const joker = document.querySelector('#joker');


    // RUN GAME
    Start();
    AskQuestion();
    Answer();
    // RUN GAME

    joker.addEventListener('click', () => {
        if (defaultJockerCount > 0 && status) {
            defaultJockerCount--;
            DeleteAnswer();
        }

        if (defaultJockerCount <= 0) {
            joker.classList.add('disabled');
        }
    });

    pass.addEventListener('click', () => {
        if (defaultScore >= passBalance && status) {
            passQuestion();
        } else {
            const s = confirm("Your account does not have enough balance. Do you want to buy?");

            if (s) GoStore();
        }
    });


    function Start() {
        score.innerText = defaultScore;
        soul.innerText = defaultSoul;
        questionCount.innerText = index + defaultQuestionCount;
        balance.innerText = passBalance;
    }

    function DeleteAnswer() {
        const correctVariant = Questions[index]?.dogruCevap;
        const correctAnswer = Questions[index]?.cevaplar[correctVariant];
        const max = variant.length - 1;

        for (let i = 0; i < variant.length / 2; i++) {
            let value;
            let answer;
            do {
                value = Random(max);
                answer = variant[value]?.innerText;
            } while (removeIndex.includes(value) || answer === correctAnswer);

            removeIndex.push(value);
        }

        for (let remove of removeIndex) {
            variant[remove].classList.add('remove');
        }
    }

    function Random(max, min = 0) {
        return Math.floor(min + Math.random() * (max - min));
    }

    function GoStore() {
        alert("Welcome to Store :) | Premium: 50$");
    }

    function AskQuestion() {
        for (let remove of removeIndex) {
            variant[remove].classList.remove('remove');
        }
        questionText.innerText = Questions[index]?.soru;
        variant[0].innerText = Questions[index]?.cevaplar?.A;
        variant[1].innerText = Questions[index]?.cevaplar?.B;
        variant[2].innerText = Questions[index]?.cevaplar?.C;
        variant[3].innerText = Questions[index]?.cevaplar?.D;

        status = true;
        removeIndex = [];
    }

    function Lost() {
        setTimeout(() => {
            const s = confirm("The game is over, start again?");
            localStorage.setItem("score", defaultScore);
            s ? window.open('index.html', '_parent') : Lost();
        }, clearTime);
    }

    function Next() {
        if (index < Questions.length - 1) index++;
        else {
            defaultQuestionCount += (index + 1);
            index = 0;
        }
    }

    function Answer() {
        variant.forEach(v => v.addEventListener("click", () => {
            if (status) {
                status = false;
                v.classList.add('select');

                const myAnswer = v.innerText;
                const trueVariant = Questions[index]?.dogruCevap;
                const trueAnswer = Questions[index]?.cevaplar[trueVariant];

                setTimeout(() => {

                    v.classList.remove('select');

                    if (myAnswer === trueAnswer) {

                        v.classList.add('success');
                        defaultScore++;

                        Next();

                        setTimeout(() => {
                            v.classList.remove('success');
                            AskQuestion();
                        }, clearTime);

                    } else {

                        v.classList.add('error');
                        defaultSoul--;

                        if (defaultSoul > 0) status = true;
                        else Lost();

                        setTimeout(() => {
                            v.classList.remove('error');

                        }, clearTime);

                    }


                    Start();

                }, answerTime);
            }
        }));
    }

    function passQuestion() {
        defaultScore -= passBalance;
        passBalance *= 2;
        localStorage.setItem('score', defaultScore);
        Next();
        Start();
        AskQuestion();
    }
});