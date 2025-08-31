# Introduction
Small library project featuring newly learned knowledge about JavaScript object constructors.

It is a part of The Odin project: https://www.theodinproject.com/lessons/node-path-javascript-library

# Functionality
- Displaying list of books in a table
- Adding new books via modal dialog
- Additional functionality - pager

# Reflection
Important topics learned/practiced:

- object constructors
- prototype inheritance
- data-* attribute
- dialog
- tables
- processing forms data
- simple custom table pager

Although adding pager wasn't an objective of this project I felt like it just fits here.
That's why I implemented it.

# Limitations
According to the project's steps objects are going to be stored in an arraylist.
However, it has some negative performance implications considering project functionality.

Let me elaborate. For instance, the raw process of book deletion has O(N) time complexity.
Since after using the delete button,
arraylist will be searched linearly for a book with the same id as was bound to the clicked button.
The same problem arises in other parts of the project for the same reason.

The issue could be solved at the cost of additional memory using some kind of hashing data structure.

I also have to mention that the issue I described above would be neglectable in case of arraylist storing a few items.
