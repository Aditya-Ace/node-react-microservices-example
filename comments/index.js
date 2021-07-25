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
  comments.push({ id, commentId, content })
  commentsByPostId[id] = comments
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: id,
    },
  })
  res.status(201).send({ mes: "Post created successfully.", comments })
})
app.post("/events", (req, res) => {
  console.log("Event Received : ", req.body.type)
  res.status(200).send({ msg: "Event Received" })
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
