const request = require('supertest')

const connection = require('../src/config/mongoose-setup')
const db = require('../utils/db')
const app = require('../src/app')

beforeAll(db.drop())
afterAll(() => connection.close())

const testUser = {
  username: 'testUser',
  password: 'hunter2',
}

let testUserToken = ''

describe('User auth routes', () => {
  it('Requires username for signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ password: 'hunter2' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      error: 'Username and password required',
    })
  })

  it('Requires password for signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'badUser' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      error: 'Username and password required',
    })
  })

  it('Requires username for signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ password: 'hunter2' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      error: 'Invalid username or password',
    })
  })

  it('Requires password for signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'badUser' })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toEqual({
      error: 'Invalid username or password',
    })
  })

  it('Signs a user up', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser)

    testUserToken = res.body.token
    expect(res.statusCode).toEqual(200)
    expect(res.body.token).toBeTruthy()
  })

  it('Signs a user in', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send(testUser)
    expect(res.statusCode).toEqual(200)
    expect(res.body.token).toEqual(testUserToken)
  })

  it('Rejects a bad password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'testUser', password: 'wrongPW' })
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual('Invalid username or password')
  })

  it('Rejects bad username in signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'does not exist', password: 'hunter2' })
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual('Invalid username or password')
  })

  it('Rejects username that already exists in signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual('Username testUser already exists')
  })

  it('Validates good tokens', async () => {
    const res = await request(app)
      .get('/api/auth/validate')
      .set('authorization', testUserToken)
    expect(res.body.valid).toEqual(true)
  })

  it('Invalidates bad tokens', async () => {
    const res = await request(app)
      .get('/api/auth/validate')
      .set('authorization', 'aslkj2141gdg')
    expect(res.statusCode).toEqual(403)
    expect(res.body.error).toEqual('Unauthorized, bad token')
  })
})
