var should = require('should')
const app = require('../../index')
var request = require('supertest')(app)

var mockUser = {
  email: 'jford@gmail.com',
  password: 'ola1234'
}

describe('Test Viter API EndPoints', () => {
  var token

  before((done) => {
    request
      .post('/login')
      .send(mockUser)
      .end((err, res) => {
        if (err) console.log("OLAAAAA"+err)
        token = { 'x-access-token': res.body.token }
        done()
      })
  })

  it('Testing Welcome EndPoint', (done) => {
    request.get('/welcome')
      .set(token)
      .expect(200)
      .end((err, res) => {
        should(err).equal(null)
        should(res.text).be.exactly('Welcome to Viter')
        done()
      })
  })
})
