const express = require("express")
const cors = require("cors")
const axios = require("axios")

const { randomBytes } = require("crypto")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4000
app.use(cors())

const posts = {}
app.get("/posts", (req, res) => res.status(200).send(posts))
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex")
  const { title } = req.body
  const data = { id, title }
  posts[id] = { id, title }
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data,
  })
  res.status(201).send({ mes: "Post created successfully.", data })
})
app.post("/events", (req, res) => {
  console.log("Event Received : ", req.body.type)
  res.status(200).send({ msg: "Event Received" })
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
