require("dotenv").config()

const express = require ("express")
const https = require("https")

const app = express()
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
    // console.log(req.body.firstName, req.body.lastName, req.body.email);

    const data = {
        members: [
            {
                email_address: req.body.email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.firstName,
                    LNAME: req.body.lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us5.api.mailchimp.com/3.0/lists/2c9fef1b81"

    const options = {
        method: "POST",
        auth: process.env.NAMEANDAPI
    }

    const request = https.request(url, options, (response) => {
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData)
    request.end()
})

app.listen(process.env.PORT || 3000,() => {
    console.log("server is up running");
})