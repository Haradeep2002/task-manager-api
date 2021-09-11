jest.setTimeout(1000000000)

const request = require('supertest')

const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase)


test('should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name:'fake fakest',
        email:'faker123@gmail.com',
        password:'$Thisisfake123'
    }).expect(201)

    const user = await User.findById(response.body.user._id)

    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name:'fake fakest',
            email:'faker123@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe()
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non existing user', async () => {
    await request(app).post('/users/login').send({
        email:userOne.email,
        password: 'thisissurelywrong'
    }).expect(400)
})

test('should get profile for users',async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated users',async () => {
    await request(app)
        .get('/users/me')
        //.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)

    expect(user).toBeNull()
})

test('should not delete account for unauthenticates user', async () => {
    await request(app)
        .delete('/users/me')
        //.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(401)
})

test('should upload avatar image',async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'haradeep'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('haradeep')
})

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location:'haradeep'
        })
        .expect(400)
})