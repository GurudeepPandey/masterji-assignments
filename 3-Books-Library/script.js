// collect all references
const searchInput = document.querySelector("#searchBook")
const sortBook = document.querySelector("#sortBook")
const view = document.querySelector("#view")
const container = document.querySelector(".book-container")
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const pagenoDiv = document.querySelector("#pagenoDiv")
let pageno = 1
let bookStore = []
let viewType = "grid"

// function to fetch book details
async function fetchBookDetails(pageno) {
    bookStore = []
    try {
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${pageno}&limit=10`)
        const data = await response.json();

        // extract specific book details
        for (const book of data.data.data) {
            bookStore.push({
                "title": book.volumeInfo.title,
                "author": book.volumeInfo.authors?.[0] || "Unknown",
                "publisher": book.volumeInfo?.publisher || "Unknown",
                "publishedDate": book.volumeInfo?.publishedDate || "2024",
                "thumbnail": book.volumeInfo.imageLinks?.thumbnail || "./Images/default.png",
                "infoLink": book.volumeInfo.infoLink
            })
        }
        return bookStore;
    } catch (err) {
        console.log("Error during fetching book details: ", err);
    }
}

// function to display books on DOM
function displayBooks(books) {
    container.innerHTML = ""
    for (const book of books) {
        container.innerHTML += `
        <div class="card">
            <a class="thumbnail" href="${book.infoLink}" target="_blank">
                <img src="${book.thumbnail}" alt="">
            </a>
            <div class="info">
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Publisher: ${book.publisher}</p>
                <p>Published Date: ${book.publishedDate}</p>
            </div>
        </div>
        `
    }

    // If user select grid view or list view
    if (viewType === "grid") {
        changeView("grid")
    } else {
        changeView("list")
    }
}

// function to change from list to grid or vice versa
function changeView(view) {
    const card = document.querySelectorAll(".card")
    if (view === "grid") {
        viewType = "grid"
        container.classList.add("grid")
        container.classList.remove("list")
        card.forEach((card) => {
            card.style.flexDirection = "column"
            card.style.width = "280px"
            card.firstElementChild.style.width = "100%"
        })
    }
    else {
        viewType = "list"
        container.classList.remove("grid")
        container.classList.add("list")
        card.forEach((card) => {
            card.style.flexDirection = "row"
            card.style.width = "100%"
            card.firstElementChild.style.width = "200px"
        })
    }
}

// function to work after page change
function workAfterPageChange() {
    fetchBookDetails(pageno)
        .then((data) => {
            displayBooks(data)
        })
    pagenoDiv.innerText = pageno
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    sortBook.value = "empty"
    searchInput.value = ""
}

// calling functions and load books details when page loads
fetchBookDetails(pageno)
    .then((data) => {
        console.log(data)
        displayBooks(data)
    })

// When user search book
searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.trim()
    const filterData = bookStore.filter((book) => book.title.toLowerCase().includes(searchValue) || book.author.toLowerCase().includes(searchValue))
    displayBooks(filterData)
    if (filterData.length === 0) {
        container.innerHTML = `<h2 style="text-align: center;">Book not found</h2>`
    }
})

// When user sort book
sortBook.addEventListener("change", () => {
    const value = sortBook.value;
    if (value === 'a-z') {
        bookStore.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'z-a') {
        bookStore.sort((a, b) => b.title.localeCompare(a.title));
    } else if (value === 'old') {
        bookStore.sort((a, b) => a.publishedDate.localeCompare(b.publishedDate));
    } else if (value === 'new') {
        bookStore.sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
    }
    displayBooks(bookStore);
});

// When user change view
view.addEventListener("change", () => {
    changeView(view.value)
})

// when user click prev button
prevBtn.addEventListener("click", () => {
    if (pageno === 1) {
        prevBtn.disabled = true
        return;
    }
    nextBtn.disabled = false
    pageno--
    workAfterPageChange();
})

// when user click next button
nextBtn.addEventListener("click", () => {
    if (pageno === 21) {
        nextBtn.disabled = true
        return;
    }
    prevBtn.disabled = false
    pageno++
    workAfterPageChange()
})