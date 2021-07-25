const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4002
app.use(cors())

const posts = {}

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

app.get("/posts", (req, res) => {
  res.status(200).send(posts)
})
app.post("/events", (req, res) => {
  const { type, data } = req.body
  if (type === "PostCreated") {
    const { id, title } = data
    posts[id] = { id, title, comments: [] }
  }
  if (type === "CommentCreated") {
    const { id, content, postId } = data
    const post = posts[postId]
    post.comments.push({ id, content })
  }
  console.log("Response Received : ", req.body.type)
  console.log("All posts ", posts)
  res.status(201).send({
    msg: `We received the event type:  ${type} and processed it accordingly.`,
  })
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
