const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 4005
app.use(cors())

const events = []
app.post("/events", async (req, res) => {
  const { type, data } = req.body
  const event = {
    type,
    data,
  }
  events.push(event)
  try {
    await axios.post("http://localhost:4002/events", event)
    await axios.post("http://localhost:4003/events", event)
    await axios.post("http://localhost:4000/events", event)
    await axios.post("http://localhost:4001/events", event)

    res.send({ status: "OK" })
  } catch (error) {
    console.error(error)
    res.send({ status: "FAIL" })
  }
})

app.get("/events", (req, res) => {
  res.status(200).send(events)
})

app.listen(PORT, () =>
  console.log(`Server has been started on the port ${PORT}`)
)
