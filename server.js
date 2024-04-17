import compression from 'compression'
import express from 'express'
import path from 'path'

const app = express()

app.use(express.static('dist', { maxAge: '7d' }))
app.use(compression())

app.use('*', (_, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'))
})

app.listen(3001, () => {
  console.log('Application is running at http://0.0.0.0:3001')
})
