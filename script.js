const tableContents = document.querySelector('table tbody');

const modalDialog = document.querySelector('dialog');
const showModalBtn = document.querySelector('button.show-modal');
const form = document.querySelector('form');

const currPageOutput = document.querySelector('.pager-controls output');
const totalItemsOutput = document.querySelector('.pager-info output');

const myLibrary = [];

(function () {
    const TITLE_MESSAGE = "The title field must be filled!";
    const AUTHOR_MESSAGE = "The author name must be filled!";

    const confirmBtn = document.querySelector('#confirm-btn');
    const titleField = document.querySelector('#title-field');
    const authorField = document.querySelector('#author-field');

    confirmBtn.addEventListener('click', validateBeforeSubmit);

    titleField.addEventListener('input', () => {
        signalizeValidity(titleField, TITLE_MESSAGE);
    });

    authorField.addEventListener('input', () => {
        signalizeValidity(authorField, AUTHOR_MESSAGE);
    });

    /**
     *
     * @param {HTMLInputElement} field
     * @param {string} message
     */
    function signalizeValidity(field, message) {
        if (field.validity.valueMissing) {
            field.setCustomValidity(message);
        } else {
            field.setCustomValidity("");
        }
    }

    function validateBeforeSubmit() {
        signalizeValidity(titleField, TITLE_MESSAGE);
        signalizeValidity(authorField, AUTHOR_MESSAGE);
    }
})();

const pager = (function () {
    const PAGE_SIZE = 5;

    let currPage = 1;

    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {array} An array containing the elements for the current page
     */
    function getCurrentPage(allElements) {
        const pageElements = [];

        const firstIndex = (currPage - 1) * PAGE_SIZE;
        const possibleLastIndex = firstIndex + PAGE_SIZE;
        const lastIndex = (possibleLastIndex > allElements.length) ? allElements.length : possibleLastIndex;

        for (let i = firstIndex; i < lastIndex; i++) {
            pageElements.push(allElements[i]);
        }

        return pageElements;
    }

    /**
     *
     * @returns {boolean} True if successfully moved to previous page, false if already at first page
     */
    function prevPage() {
        const canGo = currPage - 1 > 0;

        if (canGo) {
            currPage -= 1;
        }

        return canGo;
    }

    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {boolean} True if successfully moved to next page, false if already at last page
     */
    function nextPage(allElements) {
        const firstIndex = (currPage) * PAGE_SIZE;
        const canGo = firstIndex < allElements.length;

        if (canGo) {
            currPage += 1;
        }

        return canGo;
    }

    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {boolean} True if current page is valid, false otherwise
     */
    function isCurrentPageValid(allElements) {
        const firstIndex = (currPage - 1) * PAGE_SIZE;

        return firstIndex < allElements.length;
    }

    /**
     *
     * @returns {number}
     */
    function getCurrPageNumber() {
        return currPage;
    }

    return {getCurrentPage, prevPage, nextPage, isCurrentPageValid, getCurrPageNumber};
})();

class Book {
    #id = crypto.randomUUID();

    /**
     *
     * @param {string} title
     * @param {string} author
     * @param {string} genre
     * @param {number} pages
     * @param {boolean} read
     */
    constructor(title, author, genre, pages, read) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.pages = pages;
        this.read = read;
    }

    /**
     *
     * @returns {`${string}-${string}-${string}-${string}-${string}`}
     */
    getId() {
        return this.#id;
    }

    toggleReadStatus() {
        this.read = !this.read;
    }

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
 * @param bookId
 * @returns {HTMLTableCellElement}
 */
function createActionButtons(bookId) {
    const tableData= document.createElement('td');
    const buttonsContainer = document.createElement('div');

    const readButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    readButton.textContent = 'Read';
    readButton.dataset.bookId = bookId;
    readButton.classList.add('read-btn');

    deleteButton.textContent = 'Delete';
    deleteButton.dataset.bookId = bookId;
    deleteButton.classList.add('delete-btn');

    buttonsContainer.classList.add('action-buttons');

    buttonsContainer.appendChild(readButton);
    buttonsContainer.appendChild(deleteButton);
    tableData.appendChild(buttonsContainer);

    return tableData;
}

/**
 *
 * @param {boolean} read
 * @returns {HTMLTableCellElement} returns table cell containing visual info about book read status
 */
function createReadBookCell(read) {
    const tableData = document.createElement('td');
    tableData.textContent = read ? "✔" : "𝞦";

    return tableData;
}

/**
 *
 * @param {Book} book
 * @returns {HTMLTableRowElement}
 */
function creatTableRow(book) {
    const tableRow = document.createElement('tr');

    const keysToIterate= ["title", "author", "genre", "pages"];

    for (let key of keysToIterate) {
         const tableData = document.createElement('td');
         tableData.textContent = book[key];

         tableRow.appendChild(tableData);
    }

    tableRow.appendChild(createReadBookCell(book.read))
    tableRow.appendChild(createActionButtons(book.getId()));

    return tableRow;
}

function displayAllBooks() {
    tableContents.innerHTML = '';

    const page = pager.getCurrentPage(myLibrary);
    for (let book of page) {
        const tableRow = creatTableRow(book);
        tableContents.appendChild(tableRow);
    }

    currPageOutput.textContent = "" + pager.getCurrPageNumber();
    totalItemsOutput.textContent = "" + myLibrary.length;
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

/**
 *
 * @param {number} bookIdx
 */
function deleteBook(bookIdx) {
    myLibrary.splice(bookIdx, 1);
    if (pager.isCurrentPageValid(myLibrary)) return;

    pager.prevPage();
}

/**
 *
 * @param event
 */
function handleActionButton(event) {
    const bookId = event.target.dataset.bookId;
    if (bookId === undefined) return;

    const bookIdx = myLibrary.findIndex(book => book.getId() === bookId);

    if (bookIdx < 0) return;

    if (event.target.classList.contains('delete-btn')) {
        deleteBook(bookIdx);
    } else if (event.target.classList.contains('read-btn')) {
        myLibrary[bookIdx].toggleReadStatus();
    }

    displayAllBooks();
}

// just for demonstration purposes
function populateLibrary() {
    addBookToLibrary("Lord of the Rings", "J.R.R Tolkien", "Fantasy", 1077, true);
    addBookToLibrary("The hobbit", "J.R.R Tolkien", "Fantasy", 372, true);
    addBookToLibrary("Mistborn: The Final Empire", "Brandon Sanderson", "Fantasy", 541, true);
    addBookToLibrary("Effective Java", "Joshua Bloch", "Programming", 412, false);
    addBookToLibrary("Clean code", "Rober C. Martin", "Programming", 464, false);
    addBookToLibrary("Spring Start Here", "Laurentiu Spilca", "Programming", 416, false);

    displayAllBooks()
}

showModalBtn.addEventListener('click', showModal);
document.querySelector('#cancel-btn').addEventListener('click', () => modalDialog.close());
form.addEventListener('submit', handleFormSubmit);

tableContents.addEventListener('click', handleActionButton)

document.querySelector('#previous-btn').addEventListener('click', () => {
    if (pager.prevPage()) {
        displayAllBooks();
    }
});

document.querySelector('#next-btn').addEventListener('click', () => {
    if (pager.nextPage(myLibrary)) {
        displayAllBooks();
    }
});

populateLibrary();