
const supertest = require("supertest");
const app = require('../../app')

describe('GET : /healthz ', () =>{
  describe('When DB server is connected and ORM is configured correctly', () => {
      it('should return 200 OK', async() =>{
         const {statusCode, body} = await supertest(app)
            .get('/healthz')
            .send({})
               
         expect(statusCode).toBe(200);
         expect(body).toEqual({})
      })
  })
})