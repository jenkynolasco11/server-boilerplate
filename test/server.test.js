import mocha from 'mocha'
import chai, { /* assert, */ expect, /* should as s */} from 'chai'
import chaiPromise from 'chai-as-promised'
import chaiHttp from 'chai-http'
import app from '../src/app'

chai.use(chaiHttp)

let server = null

describe('Server =>', () => {
  before(async() => {
    try {
      server = await app()
    } catch (e) { }
  })

  it('Should return "Hello" on /', done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body).to.haveOwnProperty('msg')
        expect(res.body.msg).to.be.eql('Hello', 'OH SNAP! Not equal to Hello???')
        expect(res.body.msg).not.to.be.eql('Hell')
        done()
      })
  })

  it('Should fail if any other route...', done => {
    chai
      .request(server)
      .get('/help')
      // .set('Content-Type', 'text/plain;')
      .end((err, res) => {
        expect(res).to.have.status(404)
        expect(res.body).to.be.empty
        done()
      })
      // .catch(e => {
      //   console.log(e)
      // })

  })

  after(() => {
    console.log('Closing the server...')
    server.close()
  })
})

describe('API =>', () => {
  before(async() => {
    try {
      server = await app()
    } catch(e) { }
  })

  it('Should return Success on /api/v1/test/{ any expect 2 }...', done => {
    chai
      .request(server)
      .get('/api/v1/test/4')
      .end((err, res) => {
        expect(res).to.be.status(200)
        expect(res.body).to.haveOwnProperty('ok')
        expect(res.body).to.haveOwnProperty('msg')
        expect(res.body.ok).to.be.true
        expect(res.body.msg).to.be.eql('Test route success')

        done()
      })
  })

  it('Should fail when { 2 } is sent...', done => {
    chai
      .request(server)
      .get('/api/v1/test/2')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.haveOwnProperty('msg')
        expect(res.body).to.haveOwnProperty('ok')
        expect(res.body.ok).to.be.false
        expect(res.body.msg).to.be.eql('Oh snap...')

        done()
      })
  })

  after(() => {
    console.log('Closing the server...')
    server.close()
  })
})

describe('AUTH =>', () => {
  before(async() => {
    try {
      server = await app()
    } catch(e) { }
  })

  it('Should log in successfuly...', done => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ username : 'jenky', password : '12345' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.haveOwnProperty('ok')
        expect(res.body).to.haveOwnProperty('data')
        expect(res.body).to.haveOwnProperty('msg')
        expect(res.body.ok).to.be.true
        expect(res.body.data).not.to.be.empty
        expect(res.body.data).to.haveOwnProperty('name')
        expect(res.body.data).to.haveOwnProperty('id')
        expect(res.body.msg).not.to.be.empty
        expect(res.body.msg).to.be.eql('You logged in')

        done()
      })
  })

  it('Should still be logged in...', done => {
    const agent = chai.request.agent(server)
    agent
      .post('/api/v1/auth/login')
      .send({ username : 'jenky', password : '12345' })
      .end((err, res) => {

        return agent
          .get('/api/v1/auth/check-auth')
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.haveOwnProperty('ok')
            expect(res.body).to.haveOwnProperty('data')
            expect(res.body).to.haveOwnProperty('msg')

            expect(res.body.ok).to.be.true
            expect(res.body.data).to.be.null
            expect(res.body.msg).not.to.be.empty
            expect(res.body.msg).to.be.eql('User is logged in')
            
            done()
          })
      })
  })

  it('Should log out successfuly...', done => {
    const agent = chai.request.agent(server)
    agent
      .post('/api/v1/auth/login')
      .send({ username : 'jenky', password : '12345' })
      .end((err, res) => {

        return agent
          .get('/api/v1/auth/logout')
          .end((err, res) => {
            expect(res).to.redirectTo('http://127.0.0.1:8000/').and.to.have.status(200)
            expect(res.body).to.haveOwnProperty('msg')
            expect(res.body.msg).not.to.be.empty
            expect(res.body.msg).to.be.eql('Hello')
    
            done()
          })
      })
  })
  
  it('Should "NOT" still logged in...', done => {
    const agent = chai.request.agent(server)
    agent
      .post('/api/v1/auth/login')
      .send({ username : 'jenky', password : '12345' })
      .end((err, res) => {

        return agent
          .get('/api/v1/auth/logout')
          .end((err, res) => {
            return agent
              .get('/api/v1/auth/check-auth')
              .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.haveOwnProperty('ok')
                expect(res.body).to.haveOwnProperty('data')
                expect(res.body).to.haveOwnProperty('msg')
                expect(res.body.ok).not.to.be.true
                expect(res.body.data).to.be.null
                expect(res.body.msg).not.to.be.empty
                expect(res.body.msg).to.be.eql('User is not logged in')

                done()
              })
          })
      })
  })
  
  it('Should redirect if bad login...', done => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({ username : 'jen', password : '1' })
      .end((err, res) => {
        expect(res).to.redirectTo('http://127.0.0.1:8000/404')
        expect(res).to.have.status(404)

        done()
      })
  })

  after(() => {
    console.log('Closing the server...')
    server.close()
  })
})