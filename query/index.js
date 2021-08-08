const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4002
app.use(cors())

/**
 * Example of our post data structure
 * @posts = {
 *    "jp123": {
 *     id: "jp123",
 *     title: "My first post!",
 *     comments: [
 *      {id: "kl123", content: "comment!"},
 *      {id: "kl112", content: "comments!"},
 *      ]
 *  },
 *   "jp124": {
 *     id: "jp124",
 *     title: "My second post!",
 *     comments: [
 *      {id: "kl124", content: "comment!"},
 *      {id: "kl113", content: "comments!"},
 *      ]
 *  }
 * }
 */
const posts = {}

const handleEvent = (type, data) => {
  console.log(type)
  if (type === "PostCreated") {
    const { id, title } = data
    posts[id] = { id, title, comments: [] }
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data
    const post = posts[postId]
    post.comments.push({ id, content, status })
  }

  if (type === "CommentModerated") {
    const { id, content, postId, status } = data
    const post = posts[postId]
    const comment = post.comments.filter((comment) => comment.id === id)
    comment.status = status
    comment.content = content
  }
}
app.get("/posts", (req, res) => {
  res.status(200).send(posts)
})

app.post("/events", (req, res) => {
  const { type, data } = req.body
  handleEvent(type, data)
  res.status(201).send({
    msg: `We received the event type:  ${type} and processed it accordingly.`,
  })
})

app.listen(PORT, async () => {
  try {
    console.log(`Server has been started on the port ${PORT}`)
    const response = await axios.get("http://localhost:4005/events")
    for (let event of response.data) {
      console.log("Processing event: ", event.type)
      handleEvent(event.type, event.data)
    }
  } catch (error) {
    console.error(error)
  }
})
