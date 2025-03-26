
const searchInput = document.querySelector("#searchBook")
const sortBook = document.querySelector("#sortBook")
const container = document.querySelector(".container")
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const pagenoDiv = document.querySelector("#pagenoDiv")
let pageno = 1
let bookStore = []

async function fetchBookDetails(pageno) {
    bookStore = []
    try {
        const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${pageno}&limit=10`)
        const data = await response.json();
        // console.log(data.data.data);
        for (const book of data.data.data) {
            bookStore.push({
                "title": book.volumeInfo.title,
                "author": book.volumeInfo.authors?.[0] || "Unknown",
                "publisher": book.volumeInfo?.publisher || "Unknown",
                "publishedDate": book.volumeInfo?.publishedDate || "2024",
                "thumbnail": book.volumeInfo.imageLinks?.thumbnail || "./Images/default.png",
                "infoLink": book.volumeInfo.infoLink
            })
            // console.log(bookStore)
        }
        return bookStore;

    } catch (err) {
        console.log(err);
    }
}

fetchBookDetails(pageno)
    .then((data) => {
        console.log(data)
        displayBooks(data)
    })

function displayBooks(books) {
    container.innerHTML = ""
    for (const book of books) {
        container.innerHTML += `
        <div class="card">
            <div class="thumbnail">
                <img src="${book.thumbnail}" alt="">
            </div>
            <div class="info">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.publisher}</p>
                <p>${book.publishedDate}</p>
            </div>
        </div>
        `
    }
}

prevBtn.addEventListener("click", () => {
    if (pageno === 1) {
        prevBtn.disabled = true
        return;
    }
    nextBtn.disabled = false
    pageno--
    pagenoDiv.innerText = pageno
    fetchBookDetails(pageno)
        .then((data) => {
            displayBooks(data)
        })
    window.scrollTo({
            top: 0,
            behavior: "smooth"
    });
    sortBook.value = "empty"
    searchInput.value = ""
    // handlePageChange("prev")
})

nextBtn.addEventListener("click", () => {
    if (pageno === 21) {
        nextBtn.disabled = true
        return;
    }
    prevBtn.disabled = false
    pageno++
    pagenoDiv.innerText = pageno
    fetchBookDetails(pageno)
        .then((data) => {
            displayBooks(data)
        })
    window.scrollTo({
            top: 0,
            behavior: "smooth"
    });
    sortBook.value = "empty"
    searchInput.value = ""
    // handlePageChange("next")
})

// function handlePageChange(btn) {
//     if (btn === "prev" && pageno <= 1) {
//         prevBtn.disabled = true
//         return;
//     }
//     if(btn === "next" && pageno == 21) {
//         nextBtn.disabled = true
//         return
//     }
//     let nextpage = "prev" ? pageno-- : pageno++;
//     pagenoDiv.innerText = nextpage
//     fetchBookDetails(nextpage)
//     .then( (data) => {
//         displayBooks(data)
//     })
// }

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.trim()
    const filterData = bookStore.filter((book) => book.title.toLowerCase().includes(searchValue) || book.author.toLowerCase().includes(searchValue))
    displayBooks(filterData)
    if (filterData.length === 0) {
        container.innerHTML = `<h2 style="text-align: center;">Book not found</h2>`
    }
})

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