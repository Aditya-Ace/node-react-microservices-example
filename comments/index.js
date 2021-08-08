const express = require("express")
const cors = require("cors")
const axios = require("axios")

const { randomBytes } = require("crypto")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4001
app.use(cors())

const commentsByPostId = {}

app.get("/posts/:id/comments", (req, res) => {
  const id = req.params.id
  res.status(200).send(commentsByPostId[id] || [])
})

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex")
  const id = req.params.id
  const { content } = req.body
  const comments = commentsByPostId[id] || []
  comments.push({ id, commentId, content, status: "pending" })
  commentsByPostId[id] = comments
  res.status(201).send({ mes: "Post created successfully.", comments })
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: id,
      status: "pending",
    },
  })
})

app.post("/events", async (req, res) => {
  const { type, data } = req.body

  if (type === "CommentModerated") {
    try {
      const { postId, id, status, content } = data
      const comments = commentsByPostId[postId]
      const comment = comments.filter((comment) => comment.id === id)
      comment.status = status
      await axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          content,
          status,
        },
      })
      res.status(201).send({ mes: "Comment created successfully.", data })
    } catch (error) {
      console.error(error)
    }
  }
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
