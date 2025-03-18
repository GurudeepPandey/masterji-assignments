const img_cont = document.querySelector(".img-cont");
const quote_div = document.querySelector("#quote");
const author_div = document.querySelector("#author");
const btn = document.querySelector("#btn");
const copyBtn = document.querySelector("#copyBtn");
const downloadBtn = document.querySelector("#downloadBtn");
let funcExecuted = false

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
        return { "quote": "Failed to fetch quote", "author": "unknown" }
    }
}

async function getImageUrl() {
    try {
        const response = await fetch("https://picsum.photos/400")
        console.log(response)
        response.bodyUsed = true
        console.log(response.bodyUsed)
        return { "image_url": response.url, "ReadableStream": response.body };
    } catch (error) {
        console.log("Error in fetching image: ", error)
        return "./images/default.jpg"
    }
}

async function displayQuoteAndImage() {
    try {
        const result = await getQuote()
        const { image_url, ReadableStream } = await getImageUrl()
        img_cont.style.backgroundImage = `url("${image_url}")`
        quote_div.innerText = result.quote
        author_div.innerText = result.author

        // const imageBlog = await ReadableStream.blob()
        // const imageURL = URL.createObjectURL(imageBlog)
        downloadBtn.href = image_url

    } catch (error) {
        console.log("Error in displaying quote and image: ", error)
    }
}
displayQuoteAndImage()

btn.addEventListener("click", async () => {
    if (!funcExecuted) {
        funcExecuted = true
        await displayQuoteAndImage()
        funcExecuted = false
    }
})

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(`${quote_div.innerText}`)
        .then(() => console.log("Text copy to clipboared"))
        .catch((err) => console.log("Error in copying text", err))
})