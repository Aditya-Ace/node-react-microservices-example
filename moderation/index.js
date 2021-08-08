const express = require("express")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4003

app.post("/events", async (req, res) => {
  const { type, data } = req.body

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved"
    try {
      await axios.post("http://localhost:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      res.send({ status: "OK" })
    } catch (error) {
      console.error(error)
      res.send({ status: "FAIL" })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server has been started on the port ${PORT}`)
})
