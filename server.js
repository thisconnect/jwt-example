const jwt = require('jsonwebtoken')
const app = require('express')()
const parser = require('body-parser')
const serve = require('serve-static')
const server = require('http').createServer(app)

const SECRET = '12345'

app.use(serve(__dirname + '/public'))

app.post('/token', parser.json(), (req, res, next) => {
  const { user, password, keep } = req.body

  if (user != 'user' || password != 'password'){
    return res.status(401).send({ error: 'authentication failed' }).end()
  }

  const expires = Math.floor(Date.now() / 1000) + (60)

  new Promise((resolve, reject) => {
    jwt.sign({
      exp: expires,
      iss: 'ch-00000028394'
      // "aud": // audience
      // "iat": // time token was issued
      // "nbf": // not before
    }, SECRET, {
      algorithm: 'HS256' // default 'HS256' (HMAC SHA256)
      // algorithm: 'RS256' // SECRET is private.key (RSA SHA256)
    }, (err, token) => {
      if (err){
        return reject(err)
      }
      resolve(token)
    })
  })
  .then(token => {
    res.json({
      token,
      expires,
      user: {
        name: 'demo user',
        id: 'ch-00000028394'
      }
    })
  })
  .catch(err => {
    res.status(401).send({ error: err.message }).end()
  })

})

app.get('/api/private', (req, res, next) => {
  const { body, query, headers } = req
  const token = (body && body.access_token) || headers['x-access-token']

  new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err){
        return reject(err)
      }
      resolve(decoded)
    })
  })
  .then((token) => {
    console.log(token)
    res.json({
      'supersecret': 1
    })
  })
  .catch(err => {
    res.status(401).send({ error: err.message }).end()
  })
})

server.listen(8080, () => {
  console.log('Listening on 8080')
})
