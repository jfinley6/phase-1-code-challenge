// write your code here
const imageURL = "http://localhost:3000/images/1"
const commentsURL = "http://localhost:3000/comments"

//Wait for the DOM to be loaded before calling data
document.addEventListener("DOMContentLoaded", () => {
    callData()
    callComments()
})

//Call the Image data to be used in the function renderPost
function callData() {
    fetch(imageURL)
        .then(res => res.json())
        .then(dogPost => {
            renderPost(dogPost)
        })
}

//Call the Comment data to be used in the function renderComments
function callComments() {
    fetch(commentsURL)
        .then(res => res.json())
        .then(comments => renderComments(comments))
}

//Render the title, image, and the amount of likes on the page based on the images data
function renderPost(dogPost) {
    const img = document.querySelector("#card-image")
    img.setAttribute("onclick", onclick = "handleRandomImage(event)")
    img.src = dogPost.image

    const title = document.querySelector("#card-title")
    title.textContent = dogPost.title

    const likes = document.querySelector("#like-count")
    likes.textContent = `${dogPost.likes} likes`
}

//Render the comments on the page based on the comment data
function renderComments(comments) {
    const commentList = document.querySelector("#comments-list")
    if (commentList.children.length > 0) {
        const imageClass = document.querySelectorAll(".comment")
        imageClass.forEach(image => image.remove())
    }
    comments.forEach(comment => {
        //Create elements for comment content 
        const li = document.createElement("li")
        li.textContent = comment.content
        li.classList.add("comment")
        li.style.margin = "0 0 5px 0"
        li.setAttribute("imageId", comment.id)
        const btn = document.createElement("button")
        btn.textContent = "Delete"
        btn.style.margin = "0 0 0 10px"
        btn.setAttribute("onclick", onclick = "handleDelete(event)")

        commentList.appendChild(li)
        li.appendChild(btn)
    });
}

//Function is fired when form onsubmit event happens
//Value of form input is added to the comment data and the page is rerendered
//The new comment is persisted to the server
function addComment(e) {
    const form = document.querySelector("#comment-form")
    e.preventDefault()
    let newComment = form["comment"].value;
    fetch(commentsURL, {
        method: 'POST',
        body: JSON.stringify({
            content: newComment,
            imageId: 1
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(() => {
        form.reset()
        callComments(commentsURL)
    })
}

//When a delete button is pressed, the parent element of that button (li)
//will be deleted and that specific data will be deleted from the server
function handleDelete(e) {
    let elementId = e.target.parentElement.getAttribute("imageId");
    e.target.parentElement.remove()

    fetch(`${commentsURL}/${elementId}`, {
        method: 'DELETE',
    }).then(() => callComments(commentsURL))
}

//When the heart button is clicked, the number of likes is increased and persisted to the server
function handleHeart() {
    const numberOfLikes = document.querySelector(".likes")
    numberOfLikes.textContent = `${Number(numberOfLikes.textContent.replace(/\D/g, '')) + Number(1)} likes`
    fetch(imageURL, {
        method: 'PATCH',
        body: JSON.stringify({
            likes: Number(numberOfLikes.textContent.replace(/\D/g, '')),
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
}

//When the user clicks the title, the visibility of the image will toggle on
// and off
function toggleImage() {
    const imageCard = document.querySelector(".image")
    switch (imageCard.style.display) {
        case "none":
            imageCard.style.display = ""
            break
        case "":
            imageCard.style.display = "none"
            break
    }
}

//When the user clicks the image, a new random dog image will replace it
//and be persisted to the server
function handleRandomImage(e) {
    const img = document.querySelector("#card-image")

    fetch("https://dog.ceo/api/breeds/image/random")
    .then(res => res.json())
    .then(image => {
        img.src = image.message
        fetch(imageURL, {
            method: 'PATCH',
            body: JSON.stringify({
                image: img.src,
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    })
}