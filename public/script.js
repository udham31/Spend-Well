let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalAmount = 0;

// DOM Elements
const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Initialize Data
function initialize() {
    updateTotal();
    renderTable();
}

// Add Expense
addBtn.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form submission

    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value.trim();
    const date = dateInput.value;

    // Input validation
    if (!category || isNaN(amount) || amount <= 0 || !info || !date) {
        highlightInvalidFields();
        return;
    }

    // Create Expense Object
    const expense = {
        id: Date.now(), // Unique ID
        category,
        amount,
        info,
        date,
    };

    expenses.push(expense);
    saveExpenses();
    updateTotal();
    addExpenseToTable(expense);
    clearForm();
});

// Update Total Amount
function updateTotal() {
    totalAmount = expenses.reduce((sum, expense) => {
        return expense.category === 'Income' ? sum + expense.amount : sum - expense.amount;
    }, 0);

    totalAmountCell.textContent = totalAmount.toFixed(2);
    totalAmountCell.style.color = totalAmount >= 0 ? 'green' : 'red';
}

// Render Expenses Table
function renderTable() {
    expenseTableBody.innerHTML = ''; // Clear table
    expenses.forEach(addExpenseToTable);
}

// Add Expense Row to Table
function addExpenseToTable(expense) {
    const newRow = expenseTableBody.insertRow();

    newRow.innerHTML = `
        <td>${expense.category}</td>
        <td>${expense.amount.toFixed(2)}</td>
        <td>${expense.info}</td>
        <td>${expense.date}</td>
        <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
    `;

    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function () {
        deleteExpense(expense.id);
    });
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    updateTotal();
    renderTable();
}

// Save Expenses to LocalStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Highlight Invalid Fields
function highlightInvalidFields() {
    if (!categorySelect.value) categorySelect.classList.add('invalid');
    if (isNaN(amountInput.value) || amountInput.value <= 0) amountInput.classList.add('invalid');
    if (!infoInput.value.trim()) infoInput.classList.add('invalid');
    if (!dateInput.value) dateInput.classList.add('invalid');
    setTimeout(() => {
        categorySelect.classList.remove('invalid');
        amountInput.classList.remove('invalid');
        infoInput.classList.remove('invalid');
        dateInput.classList.remove('invalid');
    }, 2000);
}

// Clear Form Inputs
function clearForm() {
    categorySelect.value = '';
    amountInput.value = '';
    infoInput.value = '';
    dateInput.value = '';
}

// Initialize App
initialize();
