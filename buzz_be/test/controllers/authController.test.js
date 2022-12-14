const bcrypt = require('bcryptjs/dist/bcrypt');
const chai = require('chai');
const path = require('path')
const sinon = require('sinon');
require('dotenv').config({ path: path.resolve(__dirname,'../../src/.env') })
const { login } = require('../../src/controllers/authcontroller')
let Users = require('../../src/models/users')
let stub,res;
const expect = chai.expect; 
let userObj = {
          _id: '12345678',
          email: 'xyz@gmail.com'
}
describe('authController', () => {
          afterEach(()=>{
                    stub.restore()
          });
          beforeEach(()=>{
          res = { header: function () { return this }, json: function () { return this }, status: function () { return this } }
          })
          it('should return success with status 200 when email and password are correct', async () => {
                    const password = 'xyzpassword'
                    userObj.password = await bcrypt.hash(password, 10)
                    stub = sinon.stub(Users, 'findOne');
                    stub.returns(userObj);
                    let req = {
                              body: {
                                        password, email: userObj.email
                              }
                    }
                    const spy=sinon.spy(res); // now spy.restore will not work ,as this will work only if spied on res's individual methods one by one, but sinon.restore will work but no need as res is renewed in beforeEach
                    await login(req, res);
                    expect(Users.findOne.calledOnce).to.be.true;
                    expect(res.status.calledOnce).to.be.true
                    sinon.assert.calledWith(res.status, 200);
                    expect(res.header.calledOnce).to.be.true
                    sinon.assert.calledWith(res.header, 'x-auth-token');//if checking for multiple args we can do like  sinon.assert.calledWith(res.header, 'x-auth-token',token(if you have));
                    expect(res.json.calledOnce).to.be.true
                    sinon.assert.calledWith(res.json, {message:'Success'})
          });
          it('should return error with status 401 when email is not correct or not registered',async ()=>{
                    stub = sinon.stub(Users, 'findOne');
                    stub.returns(null);
                    let req = {
                              body: {
                                         email: 'unknownuseremail'
                              }
                    }
                    const spy = sinon.spy(res); // now spy.restore will not work ,as this will work only if spied on res's individual methods one by one, but sinon.restore will work but no need as res is renewed in beforeEach
                    await login(req, res);
                    expect(Users.findOne.calledOnce).to.be.true;
                    expect(res.status.calledOnce).to.be.true
                    sinon.assert.calledWith(res.status, 401);
                    expect(res.json.calledOnce).to.be.true
                    sinon.assert.calledWith(res.json, { message: 'User Not Found' })
          })
          it('should return error with status 401 when password is incorrect', async () => {
                    const password = 'xyzpassword'
                    userObj.password = await bcrypt.hash(password, 10)
                    stub = sinon.stub(Users, 'findOne');
                    stub.returns(userObj);
                    let req = {
                              body: {
                                        email: 'unknownuseremail',
                                        password:'wrong-password'
                              }
                    }
                    const spy = sinon.spy(res); // now spy.restore will not work ,as this will work only if spied on res's individual methods one by one, but sinon.restore will work but no need as res is renewed in beforeEach
                    await login(req, res);
                    expect(Users.findOne.calledOnce).to.be.true;
                    expect(res.status.calledOnce).to.be.true
                    sinon.assert.calledWith(res.status, 401);
                    expect(res.json.calledOnce).to.be.true
                    sinon.assert.calledWith(res.json, { message: 'Invalid Password' })
          })
})
