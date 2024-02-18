document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

const books = [];
const RENDER_EVENT = "render-book";

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    false
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// generate id yang unik

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  for (const bookItem of books) {
    const bookElement = createBookList(bookItem);

    const inputBookIsComplete = document.getElementById("inputBookIsComplete");

    // Menentukan ke daftar mana buku harus ditambahkan
    if (inputBookIsComplete.checked == true) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});

function createBookList(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const authorName = document.createElement("p");
  authorName.innerText = "Penulis: " + bookObject.author;

  const publicationYear = document.createElement("p");
  publicationYear.innerText = "Tahun " + bookObject.year;

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book_item");

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = "Selesai dibaca";

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";

  actionContainer.append(greenButton, redButton);

  bookContainer.append(bookTitle, authorName, publicationYear, actionContainer);

  return bookContainer; // Tambahkan ini untuk mengembalikan elemen bookContainer
}
