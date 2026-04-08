const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.keys(counts).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  )

  return { author: topAuthor, blogs: counts[topAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesPerAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const topAuthor = Object.keys(likesPerAuthor).reduce((a, b) =>
    likesPerAuthor[a] >= likesPerAuthor[b] ? a : b
  )

  return { author: topAuthor, likes: likesPerAuthor[topAuthor] }
}

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }