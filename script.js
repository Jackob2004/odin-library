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
