const tableContents = document.querySelector('table tbody');

const modalDialog = document.querySelector('dialog');
const showModalBtn = document.querySelector('button.show-modal');
const form = document.querySelector('form');

const myLibrary = [];

/**
 *
 * @constructor
 * @param {string} title
 * @param {string} author
 * @param {string} genre
 * @param {number} pages
 * @param {boolean} read
 *
 * @throws {error} Will throw an error if called without the "new" keyword
 */
function Book(title, author, genre, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }

    this.title = title;
    this.author = author;
    this.genre = genre;
    this.pages = pages;
    this.read = read;

    this.id = crypto.randomUUID();
}

/**
 *
 * @param {string} title
 * @param {string} author
 * @param {string} genre
 * @param {number} pages
 * @param {boolean} read
 */
function addBookToLibrary(title, author, genre, pages, read) {
    const book = new Book(title, author, genre, pages, read);
    myLibrary.push(book);
}

/**
 *
 * @returns {HTMLDivElement}
 */
function createActionButtons() {
    const buttonsContainer = document.createElement('div');

    const readButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    readButton.textContent = 'Read';
    deleteButton.textContent = 'Delete';
    buttonsContainer.appendChild(readButton);
    buttonsContainer.appendChild(deleteButton);

    return buttonsContainer;
}

/**
 *
 * @param book
 * @returns {HTMLTableRowElement}
 */
function creatTableRow(book) {
    const tableRow = document.createElement('tr');

    const keysToIterate= ["title", "author", "genre", "pages", "read"];

    for (let key of keysToIterate) {
         const tableData = document.createElement('td');
         tableData.textContent = book[key];

         tableRow.appendChild(tableData);
    }

    tableRow.appendChild(createActionButtons());

    return tableRow;
}

function displayAllBooks() {
    tableContents.innerHTML = '';

    for (let book of myLibrary) {
        const tableRow = creatTableRow(book);
        tableContents.appendChild(tableRow);
    }
}

function handleFormSubmit() {
    const formData = new FormData(form);

    addBookToLibrary(formData.get("title"),
        formData.get("author"),
        formData.get("genre"),
        +formData.get("pages"),
        formData.get("read") === "on");

    displayAllBooks();
    form.reset();
}

function showModal() {
    form.reset();
    modalDialog.showModal();
}

showModalBtn.addEventListener('click', showModal);
document.querySelector('#cancel-btn').addEventListener('click', () => modalDialog.close());

form.addEventListener('submit', handleFormSubmit);