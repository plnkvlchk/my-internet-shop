import express from 'express'
import bodyParser from 'body-parser'
import api from './api'
//import cors from 'cors'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
//app.use(cors())


app.use('/', api)

app.use((err, req, res, next) => {
    if (err) {
        console.error(err.name + ': ' + err.message)
        res.status(500).send(err.message)
    } else {
        next(req, res)
    }
})

const server = app.listen(8080, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})