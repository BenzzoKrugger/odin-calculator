// Basic math functions
function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  if (num2 === 0) {
    return "Error"; // Handle division by zero
  }
  return num1 / num2;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
    default:
      return null;
  }
}

// Calculator state
let currentNum = '0'; // Currently displayed number
let storedNum = null; // First number in operation
let currentOperator = null; // Current operator
let shouldResetDisplay = false; // Flag to reset display after operator/equals

// DOM elements
const display = document.querySelector('#display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.querySelector('#clear');
const deleteButton = document.querySelector('#delete');
const equalsButton = document.querySelector('#equals');

// Initialize display
display.textContent = currentNum;

// Number button handler
function handleNumberClick(buttonText) {
  if (shouldResetDisplay) {
    currentNum = buttonText;
    shouldResetDisplay = false;
  } else {
    if (currentNum === '0') {
      currentNum = buttonText;
    } else {
      currentNum += buttonText;
    }
  }
  updateDisplay();
}

// Decimal point handler
function handleDecimalClick() {
  if (shouldResetDisplay) {
    currentNum = '0.';
    shouldResetDisplay = false;
  } else if (!currentNum.includes('.')) {
    currentNum += '.';
  }
  updateDisplay();
}

// Operator button handler
function handleOperatorClick(operator) {
  if (currentOperator !== null && !shouldResetDisplay) {
    // Calculate previous operation before setting new operator
    const currentValue = parseFloat(currentNum);
    if (storedNum !== null) {
      currentNum = String(operate(currentOperator, storedNum, currentValue));
      updateDisplay();
    }
    storedNum = parseFloat(currentNum);
  } else {
    storedNum = parseFloat(currentNum);
  }
  
  currentOperator = operator;
  shouldResetDisplay = true;
}

// Equals button handler
function handleEqualsClick() {
  if (currentOperator === null || storedNum === null || shouldResetDisplay) {
    return; // Nothing to calculate
  }
  
  const currentValue = parseFloat(currentNum);
  const result = operate(currentOperator, storedNum, currentValue);
  
  currentNum = String(result);
  currentOperator = null;
  storedNum = null;
  shouldResetDisplay = true;
  updateDisplay();
}

// Clear button handler
function handleClearClick() {
  currentNum = '0';
  storedNum = null;
  currentOperator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

// Delete button handler
function handleDeleteClick() {
  if (shouldResetDisplay) {
    return;
  }
  
  if (currentNum.length === 1) {
    currentNum = '0';
  } else {
    currentNum = currentNum.slice(0, -1);
  }
  updateDisplay();
}

// Format number for display, limiting length to prevent overflow
function formatDisplay(num) {
  if (num === "Error") return "Error";
  const n = Number(num);
  if (!isFinite(n)) return "Error";
  // If integer
  if (Number.isInteger(n)) {
    const s = n.toString();
    return s.length > 12 ? n.toExponential(5) : s;
  }
  // Not integer: try with up to 8 decimal places
  let s = n.toFixed(8);
  // Remove trailing zeros
  s = s.replace(/\.?0+$/, '');
  if (s.length > 12) {
    // Too long, use exponential
    return n.toExponential(5);
  }
  return s;
}

// Update display function
function updateDisplay() {
  display.textContent = formatDisplay(currentNum);
}

// Event listeners
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent.trim();
    if (text === '.') {
      handleDecimalClick();
    } else {
      handleNumberClick(text);
    }
  });
});

operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    handleOperatorClick(button.textContent.trim());
  });
});

clearButton.addEventListener('click', handleClearClick);
deleteButton.addEventListener('click', handleDeleteClick);
equalsButton.addEventListener('click', handleEqualsClick);

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    handleNumberClick(e.key);
  } else if (e.key === '.') {
    handleDecimalClick();
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    handleOperatorClick(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    handleEqualsClick();
  } else if (e.key === 'Backspace') {
    handleDeleteClick();
  } else if (e.key.toLowerCase() === 'c') {
    handleClearClick();
  }
});