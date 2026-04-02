

document.addEventListener('DOMContentLoaded', () => {
    const sizeInput = document.getElementById('tableSize');        
    const generateBtn = document.getElementById('generateBtn');
    const tableContainer = document.getElementById('table-container');  
    const timerDisplay = document.getElementById('timer');         
    const feedbackMessage = document.getElementById('result-message'); 
    const placeholderImage = document.querySelector('.image-container'); 

    let currentTimer = null;          // setInterval handle
    let currentTable = null;          // reference to the generated table
    let correctAnswer = null;          // correct product for the blank cell
    let blankInput = null;             // reference to the input field inside the table

    // Helper: clear any existing table and timer
    function resetGame() {
        if (currentTimer) {
            clearInterval(currentTimer);
            currentTimer = null;
        }
        if (currentTable) {
            tableContainer.removeChild(currentTable);
            currentTable = null;
        }
        timerDisplay.textContent = '';
        feedbackMessage.textContent = '';
        feedbackMessage.style.color = '';
        blankInput = null;
        correctAnswer = null;
        if (placeholderImage) placeholderImage.style.display = 'block';
        tableContainer.style.display = 'none';  // hidden until new table is built
    }

    // Show feedback for 2.5 seconds, then revert to initial state
    function showFeedbackAndReset(isCorrect) {
        const msg = isCorrect ? ' Correct! Well done.' : ` Incorrect. The correct answer was ${correctAnswer}.`;
        feedbackMessage.textContent = msg;
        feedbackMessage.style.color = isCorrect ? 'green' : 'red';
        feedbackMessage.style.display = 'block';

        //Adds confetti animation if user inputs correct value
        if(isCorrect) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        //flashes red background animation if user inputs incorrect value
        else {
            document.body.classList.add("flash-red");

            setTimeout(() => {
                document.body.classList.remove('flash-red');
            }, 500);
        }

        // After 2.5 seconds, hide feedback and show placeholder
        setTimeout(() => {
            feedbackMessage.style.display = 'none';
            feedbackMessage.textContent = '';
            // Reset UI to initial state
            resetGame();
            sizeInput.value = '';   // clear the input field
        }, 2500);
    }

    // Countdown logic
    function startTimer(seconds) {
        let remaining = seconds;
        timerDisplay.textContent = `${remaining} SECONDS LEFT`;

        currentTimer = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(currentTimer);
                currentTimer = null;
                timerDisplay.textContent = '0 SECONDS LEFT';

                // Evaluate user's answer
                let userAnswer = null;
                if (blankInput) {
                    const val = blankInput.value.trim();
                    userAnswer = val === '' ? NaN : Number(val);
                }
                const isCorrect = (userAnswer === correctAnswer);
                // Remove table and show feedback
                if (currentTable) {
                    tableContainer.removeChild(currentTable);
                    currentTable = null;
                }
                tableContainer.style.display = 'none';
                showFeedbackAndReset(isCorrect);
            } else {
                timerDisplay.textContent = `${remaining} SECONDS LEFT`;
            }
        }, 1000);
    }

    // Generate the multiplication table
    function generateTable(size) {
        // Clear previous
        resetGame();

        // Create table element
        const table = document.createElement('table');
        table.className = 'multiplication-table';

        // Choose a random cell position
        const randomRow = Math.floor(Math.random() * size) + 1;   // 1..size
        const randomCol = Math.floor(Math.random() * size) + 1;   // 1..size
        correctAnswer = randomRow * randomCol;

        // Build rows (including headers)
        for (let i = 0; i <= size; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j <= size; j++) {
                const td = document.createElement('td');
                // Checkerboard class: (i+j) % 2 determines which animation group
                
                // Top left empty corner
                if (i === 0 && j === 0){
                    td.textContent = '';
                }

                // Top header row
                else if (i === 0) {
                    td.textContent = j;
                }

                // Left header column
                else if (j === 0) {
                    td.textContent = i
                }

                //Regular multiplication cells
                else {
                    if (i === randomRow && j === randomCol) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.placeholder = '?';
                        td.appendChild(input);
                        blankInput = input;
                    }
                    else {
                        td.textContent = i * j;
                    }
                }

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        // Clear any existing content in table container and append new table
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        currentTable = table;
        tableContainer.style.display = 'block';
        if (placeholderImage) placeholderImage.style.display = 'none';

        // Start the timer (duration = size seconds)
        startTimer(size);
    }

    // Event handler for the generate button
    function onGenerateClick() {
        let rawValue = sizeInput.value.trim();
        if (rawValue === '') {
            feedbackMessage.textContent = 'Please enter a number between 1 and 20.';
            feedbackMessage.style.color = 'red';
            feedbackMessage.style.display = 'block';
            setTimeout(() => { feedbackMessage.style.display = 'none'; }, 2000);
            return;
        }
        const size = Number(rawValue);
        if (isNaN(size) || !Number.isInteger(size) || size < 1 || size > 20) {
            feedbackMessage.textContent = 'Invalid input. Please enter an integer from 1 to 20.';
            feedbackMessage.style.color = 'red';
            feedbackMessage.style.display = 'block';
            setTimeout(() => { feedbackMessage.style.display = 'none'; }, 2000);
            return;
        }
        feedbackMessage.style.display = 'none';
        generateTable(size);
    }

    // Attach event listener
    generateBtn.addEventListener('click', onGenerateClick);

    // Initial state: hide table container, show placeholder
    tableContainer.style.display = 'none';
    if (placeholderImage) placeholderImage.style.display = 'block';
    
    tableContainer.innerHTML = '';
});
    