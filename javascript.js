document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector(".display");
    const buttons = document.querySelectorAll(".button");

    let currentInput = '0'; // Current number being entered
    let previousInput = ''; // Previous number or the result
    let operation = null; // Nullifying current operation
    let shouldReset = false; // Toggle for resetting display
    const maxDigits = 10; // limit size of digits

    // Update display
    function updateDisplay() {
        display.textContent = currentInput;
    }
    // Clears display screen
    function clear() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        updateDisplay();
    }
    // Handle number and decimal input
    function handleNumber(num) {
        if (shouldReset) {
            currentInput = num;
            shouldReset = false;
        } else if (currentInput === '0') {
            currentInput = num;
        } else if (currentInput.replace('-', '').length < maxDigits) {
            currentInput += num;
        }
        updateDisplay();
    }
    // Handle operator
    function handleOperator(op) {
        if (operation && !shouldReset) {
            calculate();
        }
        previousInput = currentInput;
        currentInput = '0';
        operation = op;
        shouldReset = false;
    }
    // Perform calculation
    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    result = 'NOPE';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        currentInput = result.toString();
        if (currentInput.length > maxDigits) {
            currentInput = parseFloat(currentInput).toPrecision(maxDigits).toString();
        }
        operation = null;
        shouldReset = true;
        updateDisplay();
    }
    // Add a border effect
    function highlightButton(button) {
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 200); // Border to last 200ms
    }
    // Hnadle button for click and keyboard input
    function handleButtonAction(value, button = null) {
        if (button) highlightButton(button);

        if (/\d/.test(value)) {
            handleNumber(value);
        } else if (value === '.') {
            if (!currentInput.includes('.')) {
                if (currentInput.replace('-', '').length < maxDigits) {
                    currentInput += '.';
                }
                updateDisplay();
            }
        } else if (value === '+' || value === '-' || value === '×' || value === '÷') {
            handleOperator(value);
        } else if (value === '=') {
            if (operation) {
                calculate();
            }
        } else if ( value === 'AC') {
            clear();
        } else if (value === '⌫') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        } else if (value === '+/-') {
            if (currentInput !== '0') {
                currentInput = currentInput.startsWith('-')
                    ? currentInput.slice(1)
                    : '-' + currentInput;
                updateDisplay();
            }
        } else if (value === '%') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            if (currentInput.length > maxDigits) {
                currentInput = parseFloat(currentInput).toPrecision(maxDigits).toString();
            }
            updateDisplay();
        }
    }
    // Handle the button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            handleButtonAction(value, button);
        });
    });

    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        let key = event.key;
        let button = null;

        // Map keyboard keys to caluclator buttons
        switch (key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                button = document.querySelector(`#${['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][parseInt(key)]}`);
                break;
            case '.':
                button = document.querySelector('.decimal');
                break;
            case '+':
                button = document.querySelector('#add');
                break;
            case '-':
                button = document.querySelector('#subtract');
                break;
            case '*': // Use * for ×
                key = '×';
                button = document.querySelector('#multiply');
                break;
            case '/': // Use / for ÷
                key = '÷';
                button = document.querySelector('#divide');
                break;
            case 'Enter': // Use Enter for =
                key = '=';
                button = document.querySelector('#equal');
                break;
            case 'Backspace':
                key = '⌫';
                button = document.querySelector('.backspace');
                break;
            case 'c': // Use c to clear
                key = 'AC';
                button = document.querySelector('.ac');
                break;
            case 'p': // Use 'p' for +/-
                key = '+/-';
                button = document.querySelector('.plusMinus');
                break;
            case '%':
                button = document.querySelector('.percent');
                break;
        }
        // Prevent backspace default behavior
        if (key && button) {
            event.preventDefault();
            handleButtonAction(key, button);
        }
    })
    updateDisplay();  
});
