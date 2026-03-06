
import "dotenv/config"
import express from 'express'
import { Request, Response } from 'express'
const app = express()
const { readdirSync } = require('fs')
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan('dev'))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))
app.use(cors())


const routerss = async () => {
    const files = readdirSync('./src/routers')
    for (const file of files) {
        const route = await import(`./routers/${file}`)
        app.use('/api', route.default)
        console.log(file)
    }
}
routerss()


app.listen(5005, () => console.log('Server on 5005'))

