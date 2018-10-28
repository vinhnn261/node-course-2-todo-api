const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

beforeEach((done) => {
    Todo.remove({}).then(() => done()) //db empty before each test
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let test = 'Test todo text'

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text + '1')
        })
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.find().then((todos) => { //fetchs every single todo from the collection
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch(err => done(err))
        })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(0)
                done()
            }).catch(err => done(err))
        })
    })
})