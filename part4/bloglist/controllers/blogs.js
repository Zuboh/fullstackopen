const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// GET — all blogs
blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// GET — single blog
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', { username: 1, name: 1 })
    if (blog) response.json(blog)
    else response.status(404).json({ error: 'blog not found' })
  } catch (error) {
    next(error)
  }
})

// POST — create a new blog
blogsRouter.post('/', async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      ...request.body,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1,
    })

    response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

// DELETE — remove a blog
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== request.user.id.toString()) {
      return response.status(401).json({ error: 'only the creator can delete a blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    request.user.blogs = request.user.blogs.filter(
      (blogId) => blogId.toString() !== request.params.id
    )
    await request.user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// PUT — update a blog (e.g. likes)
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    )
    if (updated) response.json(updated)
    else response.status(404).json({ error: 'blog not found' })
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
