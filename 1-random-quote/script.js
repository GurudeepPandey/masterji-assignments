// collecting all references
const img_cont = document.querySelector(".img-cont");
const quote_div = document.querySelector("#quote");
const author_div = document.querySelector("#author");
const newQBtn = document.querySelector("#newBtn");
const copyBtn = document.querySelector("#copyBtn");

// function to fetch quote
async function getQuote() {
    try {
        const response = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random")
        const quote = await response.json()
        return {
            "quote": quote.data.content,
            "author": quote.data.author
        }
    } catch (error) {
        console.log("Error in fetching quote: ", error)
        // fallback quote
        return { "quote": "There is no fear for one whose mind is not filled with desires.", "author": "The Buddha" }
    }
}

// function to fetch image
async function getImageUrl() {
    try {
        const response = await fetch("https://picsum.photos/1000/400?grayscale")
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob)
        return imageUrl;
    } catch (error) {
        console.log("Error in fetching image: ", error)
        // fallback image
        return "./Images/default.jpeg"
    }
}

// function that show quote and image on screen
async function displayQuoteAndImage() {
    try {
        const result = await getQuote()
        const image_url = await getImageUrl()
        img_cont.style.backgroundImage = `url("${image_url}")`
        quote_div.innerText = result.quote
        author_div.innerText = `~ ${result.author}`
    } catch (error) {
        console.log("Error in displaying quote and image: ", error)
    }
}

// displaying quote and image when page loads
displayQuoteAndImage()

// new quote button handler
newQBtn.addEventListener("click", async () => {
    newQBtn.innerText = "Loading..."
    newQBtn.disabled = true
    await displayQuoteAndImage()
    newQBtn.innerText = "New Quote"
    newQBtn.disabled = false
})

// copy button handler
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(`${quote_div.innerText}`)
        .then(() => {
            copyBtn.innerText = "Text Copied"
            setTimeout(() => {
                copyBtn.innerText = "Copy Quote"
            }, 1000)
        })
        .catch((err) => console.log("Error in copying text", err))
})

// download button handler
document.querySelector("#downloadBtn").addEventListener("click", () => {
    html2canvas(img_cont).then((canvas) => {
        const image = canvas.toDataURL("image/jpg");
        const link = document.createElement("a");
        link.href = image;
        link.download = "quote-screenshot.png";
        link.click();
    });
})

// share button handler
document.querySelector("#shareBtn").addEventListener("click", () => {
    window.open(
        `https://twitter.com/intent/tweet?text=${quote_div.innerText} - ${author_div.innerText}`,
        "_blank"
    );
})