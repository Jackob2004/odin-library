const tableContents = document.querySelector('table tbody');

const modalDialog = document.querySelector('dialog');
const showModalBtn = document.querySelector('button.show-modal');
const form = document.querySelector('form');

const currPageOutput = document.querySelector('.pager-controls output');
const totalItemsOutput = document.querySelector('.pager-info output');

const myLibrary = [];

const pager = {
    pageSize: 5,
    currPage: 1,
    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {array} An array containing the elements for the current page
     */
    getCurrentPage: function (allElements) {
        const pageElements = [];

        const firstIndex = (this.currPage - 1) * this.pageSize;
        const possibleLastIndex = firstIndex + this.pageSize;
        const lastIndex = (possibleLastIndex > allElements.length) ? allElements.length : possibleLastIndex;

        for (let i = firstIndex; i < lastIndex; i++) {
            pageElements.push(allElements[i]);
        }

        return pageElements;
    },
    /**
     *
     * @returns {boolean} True if successfully moved to previous page, false if already at first page
     */
    prevPage: function () {
        const canGo = this.currPage - 1 > 0;

        if (canGo) {
            this.currPage -= 1;
        }

        return canGo;
    },
    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {boolean} True if successfully moved to next page, false if already at last page
     */
    nextPage: function (allElements) {
        const firstIndex = (this.currPage) * this.pageSize;
        const canGo = firstIndex < allElements.length;

        if (canGo) {
            this.currPage += 1;
        }

        return canGo;
    },
    /**
     *
     * @param {array} allElements - The complete array of elements to paginate
     * @returns {boolean} True if current page is valid, false otherwise
     */
    isCurrentPageValid: function (allElements) {
        const firstIndex = (this.currPage - 1) * this.pageSize;

        return firstIndex < allElements.length;
    },
};

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

Book.prototype.toggleReadStatus = function() {
    this.read = !this.read;
};

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
 * @param book
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
    tableRow.appendChild(createActionButtons(book.id));

    return tableRow;
}

function displayAllBooks() {
    tableContents.innerHTML = '';

    const page = pager.getCurrentPage(myLibrary);
    for (let book of page) {
        const tableRow = creatTableRow(book);
        tableContents.appendChild(tableRow);
    }

    currPageOutput.textContent = pager.currPage;
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

    const bookIdx = myLibrary.findIndex(book => book.id === bookId);

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