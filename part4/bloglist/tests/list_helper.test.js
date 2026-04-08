const { describe, it } = require('node:test')
const assert = require('node:assert')
const { totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('totalLikes', () => {
  it('returns 0 for an empty list', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  it('returns the likes of the only blog when the list has one', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 5)
  })

  it('returns the correct sum for a bigger list', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })
})


describe('favoriteBlog', () => {
  it('returns null for an empty list', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })

  it('returns the only blog when the list has one', () => {
    assert.deepStrictEqual(favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  it('returns the blog with the most likes in a bigger list', () => {
    const expected = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    }
    assert.deepStrictEqual(favoriteBlog(blogs), expected)
  })
})

describe('mostBlogs', () => {
  it('returns null for an empty list', () => {
    assert.strictEqual(mostBlogs([]), null)
  })

  it('returns the only author when the list has one blog', () => {
    const expected = { author: 'Edsger W. Dijkstra', blogs: 1 }
    assert.deepStrictEqual(mostBlogs(listWithOneBlog), expected)
  })

  it('returns the author with the most blogs in a bigger list', () => {
    const expected = { author: 'Robert C. Martin', blogs: 3 }
    assert.deepStrictEqual(mostBlogs(blogs), expected)
  })
})

describe('mostLikes', () => {
  it('returns null for an empty list', () => {
    assert.strictEqual(mostLikes([]), null)
  })

  it('returns the only author when the list has one blog', () => {
    const expected = { author: 'Edsger W. Dijkstra', likes: 5 }
    assert.deepStrictEqual(mostLikes(listWithOneBlog), expected)
  })

  it('returns the author with the most total likes in a bigger list', () => {

    const expected = { author: 'Edsger W. Dijkstra', likes: 17 }
    assert.deepStrictEqual(mostLikes(blogs), expected)
  })
})
