const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4005
app.use(cors())

app.post("/events", (req, res) => {
  const { type, data } = req.body
  const event = {
    type,
    data,
  }

  axios.post("http://localhost:4000/events", event)
  axios.post("http://localhost:4001/events", event)
  axios.post("http://localhost:4002/events", event)
  res.send({ status: "OK" })
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
