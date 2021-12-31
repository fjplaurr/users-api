import express from 'express'
import { Low, JSONFile } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()
app.use(express.json())

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

let users;

(async () => {
  await db.read();
  db.data = db.data || { users: [] }
  users = db.data.users
})()

app.get('/users', async (req, res) => {
  res.send(users)
})

app.get('/users/:name', async (req, res) => {
  const user = users.find((p) => p.name.toUpperCase() === req.params.name.toUpperCase())
  res.send(user)
})

app.post('/users', async (req, res, next) => {
  users.push(req.body)
  await db.write()
  res.send(req.body)
})

app.listen(3051, () => {
  console.log('listening on port 3051')
})