// collecting all references
const videoCont = document.querySelector(".video-cont")
const seacrhInput = document.querySelector("#searchInput")
let videos = []

// function to fetch video
async function getVideo() {
    const videoContent = []
    const response = await fetch("https://api.freeapi.app/api/v1/public/youtube/videos")
    const result = await response.json()

    for (const video of result.data.data) {
        const title = video.items.snippet.title
        const channel = video.items.snippet.channelTitle
        const thumbnail = video.items.snippet.thumbnails.high.url
        const url = `https://www.youtube.com/watch?v=${video.items.id}`
        const viewCount = video.items.statistics.viewCount
        const likeCount = video.items.statistics.likeCount
        const commentCount = video.items.statistics.commentCount

        videoContent.push({
            "title": title,
            "channel": channel,
            "thumbnail": thumbnail,
            "url": url,
            "viewCount": viewCount,
            "likeCount": likeCount,
            "commentCount": commentCount
        })
    }
    return videoContent
}

// function to show video on dom
function showVideo(result) {
    videoCont.innerHTML = ""
    for (const video of result) {
        videoCont.innerHTML += `
            <div class="card">
                <a href="${video.url}" target="_blank">
                    <img src="${video.thumbnail}" alt="Thumbnail">
                </a>
                <div>
                    <h2>${video.title}</h2>
                    <p>Channel: ${video.channel}</p>
                    <div class="stats">
                        <p>👁️ ${video.viewCount}</p>
                        <p>👍 ${video.likeCount}</p>
                        <p>💬 ${video.commentCount}</p>
                    </div>
                </div>
            </div>
        `
    }
}

// calling getVideo function
getVideo().then((result) => {
    videos = result
    showVideo(result)
})

// search functionality
seacrhInput.addEventListener("input", () => {
    const searchQuery = seacrhInput.value.toLowerCase()
    const filteredVideo = videos.filter((video) => video.title.toLowerCase().includes(searchQuery) || video.channel.toLowerCase().includes(searchQuery))
    showVideo(filteredVideo)
    if(filteredVideo.length === 0) {
        videoCont.innerHTML = `<h2 style="text-align: center;">video not found</h2>`
    }      
})