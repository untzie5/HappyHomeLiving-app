import express from "express";
const app = express()

app.get ('/', (req, res,) =>  {
    res.send('Home Page')
})

app.get ('Users', auth, (req, res) => {
    res.send('Users Page')
})

function auth (req, res) {
    if (req.query.admin === 'true') {
        req.admin = true
        next()
    } else {
        res.send ('No auth')
    }
   
}
app.listen (3000)