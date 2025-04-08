import express from "express";


const app = express();

app.use(express.json())

app.get("/", (req, res) => {

    return res.json({
        message: "Hello!, Server running."
    })
})


app.listen(8000, () => {
    console.log("Server running in Port: " + 8000)
    console.log("Host: https://localhost:" + 8000)
})