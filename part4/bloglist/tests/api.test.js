const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb } = require('../utils/test_helper')

const api = supertest(app)
let authToken
let testUser

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  await api.post('/api/users').send({
    username: 'tester',
    name: 'Test User',
    password: 'secret',
  })

  const loginResponse = await api.post('/api/login').send({
    username: 'tester',
    password: 'secret',
  })

  authToken = loginResponse.body.token
  testUser = await User.findOne({ username: 'tester' })

  const blogsWithUser = initialBlogs.map((blog) => ({
    ...blog,
    user: testUser._id,
  }))

  const savedBlogs = await Blog.insertMany(blogsWithUser)
  testUser.blogs = savedBlogs.map((blog) => blog._id)
  await testUser.save()
})

after(async () => {
  await mongoose.connection.close()
})

describe('4.8 GET /api/blogs', () => {
  it('returns blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  it('returns the user data for each blog', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body[0].user.username, 'tester')
  })
})

describe('4.9 unique identifier property', () => {
  it('blog posts have "id" property instead of "_id"', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id, 'id property should exist')
    assert.strictEqual(blog._id, undefined, '_id should not be present')
  })
})

describe('4.10 POST /api/blogs', () => {
  it('successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()
    assert.strictEqual(blogsAfter.length, initialBlogs.length + 1)

    const titles = blogsAfter.map((b) => b.title)
    assert.ok(titles.includes('Type wars'))
  })

  it('returns 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'Anonymous',
      url: 'https://example.com/no-token',
      likes: 1,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })
})

describe('4.11 POST /api/blogs — missing likes defaults to 0', () => {
  it('sets likes to 0 when the property is missing', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      // likes intentionally omitted
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
})

describe('4.12 POST /api/blogs — missing required fields', () => {
  it('returns 400 if title is missing', async () => {
    const noTitle = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(noTitle)
      .expect(400)

    const blogsAfter = await blogsInDb()
    assert.strictEqual(blogsAfter.length, initialBlogs.length)
  })

  it('returns 400 if url is missing', async () => {
    const noUrl = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(noUrl)
      .expect(400)

    const blogsAfter = await blogsInDb()
    assert.strictEqual(blogsAfter.length, initialBlogs.length)
  })
})

describe('4.13 DELETE /api/blogs/:id', () => {
  it('succeeds with status 204 for a valid existing id', async () => {
    const blogsBefore = await blogsInDb()
    const blogToDelete = blogsBefore[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAfter = await blogsInDb()
    assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)

    const titles = blogsAfter.map((b) => b.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  it('returns 404 for a non-existing id', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()
    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  })

  it('returns 400 for a malformatted id', async () => {
    await api
      .delete('/api/blogs/not-a-valid-id')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400)
  })

  it('returns 401 if token is missing', async () => {
    const blogsBefore = await blogsInDb()
    await api.delete(`/api/blogs/${blogsBefore[0].id}`).expect(401)
  })

  it('returns 401 if the user is not the blog creator', async () => {
    await api.post('/api/users').send({
      username: 'otheruser',
      name: 'Other User',
      password: 'secret',
    })

    const loginResponse = await api.post('/api/login').send({
      username: 'otheruser',
      password: 'secret',
    })

    const blogsBefore = await blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBefore[0].id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(401)
  })
})

describe('4.14 PUT /api/blogs/:id', () => {
  it('successfully updates the number of likes', async () => {
    const blogsBefore = await blogsInDb()
    const blogToUpdate = blogsBefore[0]

    const updatedData = { likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })

  it('returns 404 for a non-existing id', async () => {
    const nonExistingId = new mongoose.Types.ObjectId()
    await api.put(`/api/blogs/${nonExistingId}`).send({ likes: 99 }).expect(404)
  })

  it('returns 400 for a malformatted id', async () => {
    await api.put('/api/blogs/not-a-valid-id').send({ likes: 1 }).expect(400)
  })
})

describe('4.15-4.16 /api/users', () => {
  it('creates a user with a fresh username', async () => {
    const response = await api.get('/api/users').expect(200)
    assert.strictEqual(response.body.length, 1)

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, 2)
    assert.ok(usersAtEnd.body.map((user) => user.username).includes('mluukkai'))
  })

  it('returns blogs in the user listing', async () => {
    const response = await api.get('/api/users').expect(200)

    assert.strictEqual(response.body[0].blogs.length, initialBlogs.length)
  })

  it('fails with status 400 if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'secret',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    assert.match(response.body.error, /username/i)
  })

  it('fails with status 400 if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'secret',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    assert.match(response.body.error, /shorter than the minimum allowed length/i)
  })

  it('fails with status 400 if password is missing', async () => {
    const newUser = {
      username: 'passwordless',
      name: 'No Password',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(
      response.body.error,
      'password must be at least 3 characters long'
    )
  })

  it('fails with status 400 if password is too short', async () => {
    const newUser = {
      username: 'tiny-pass',
      name: 'Tiny Password',
      password: 'pw',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(
      response.body.error,
      'password must be at least 3 characters long'
    )
  })

  it('fails with status 400 if username is not unique', async () => {
    const newUser = {
      username: 'tester',
      name: 'Duplicate User',
      password: 'secret',
    }

    const response = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(response.body.error, 'username must be unique')
  })
})
