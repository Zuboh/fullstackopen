import { useState, useEffect } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import {
  BlogList,
  BlogListItem,
  BlogListLink,
  Button,
  ContentWrap,
  FormCard,
  MetaText,
  NavLink,
  NavigationBar,
  NavLinks,
  NavStatus,
  PageShell,
  PageTitle,
  SectionCard,
} from './components/ui'

const Navigation = ({ user, handleLogout }) => (
  <NavigationBar>
    <NavLinks>
      <NavLink to="/">blogs</NavLink>
      {user ? <NavLink to="/new">new blog</NavLink> : <NavLink to="/login">login</NavLink>}
    </NavLinks>
    {user && (
      <NavStatus>
        <span>{user.name} logged in</span>
        <Button type="button" $variant="muted" onClick={handleLogout}>logout</Button>
      </NavStatus>
    )}
  </NavigationBar>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(sortBlogsByLikes(blogs))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const savedUser = JSON.parse(loggedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const sortBlogsByLikes = (blogsToSort) => {
    return [...blogsToSort].sort((firstBlog, secondBlog) => secondBlog.likes - firstBlog.likes)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedInUser)
      )

      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      showNotification(`${loggedInUser.name} logged in`)
      navigate('/')
    } catch {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
    showNotification('logged out')
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(sortBlogsByLikes(blogs.concat(createdBlog)))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      navigate('/')
      return true
    } catch {
      showNotification('failed to create blog')
      return false
    }
  }

  const handleLikeBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, {
        user: blog.user?.id || blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      })

      const blogWithUser = {
        ...updatedBlog,
        user: blog.user,
      }

      setBlogs(sortBlogsByLikes(
        blogs.map(currentBlog =>
          currentBlog.id === blog.id ? blogWithUser : currentBlog
        )
      ))
    } catch {
      showNotification('failed to like blog')
    }
  }

  const handleRemoveBlog = async (blog) => {
    const okToRemove = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (!okToRemove) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(currentBlog => currentBlog.id !== blog.id))
      showNotification(`removed ${blog.title}`)
      navigate('/')
    } catch {
      showNotification('failed to remove blog')
    }
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find((blog) => blog.id === match.params.id)
    : null

  return (
    <PageShell>
      <ContentWrap>
        <Navigation user={user} handleLogout={handleLogout} />
        <Notification message={notification} />
        <Routes>
          <Route
            path="/"
            element={
              <SectionCard>
                <PageTitle>blogs</PageTitle>
                <BlogList>
                  {blogs.map((blog) => (
                    <BlogListItem key={blog.id}>
                      <BlogListLink to={`/blogs/${blog.id}`}>
                        {blog.title} {blog.author}
                      </BlogListLink>
                    </BlogListItem>
                  ))}
                </BlogList>
              </SectionCard>
            }
          />
          <Route
            path="/login"
            element={
              user
                ? <Navigate to="/" replace />
                : (
                  <FormCard>
                    <PageTitle>Log in to application</PageTitle>
                    <MetaText>Use your blog account to write, like and curate entries.</MetaText>
                    <div style={{ height: 18 }} />
                    <LoginForm
                      handleSubmit={handleLogin}
                      username={username}
                      password={password}
                      setUsername={setUsername}
                      setPassword={setPassword}
                    />
                  </FormCard>
                )
            }
          />
          <Route
            path="/blogs/:id"
            element={
              blog ? (
                <SectionCard>
                  <PageTitle>{blog.title}</PageTitle>
                  <Blog
                    blog={blog}
                    user={user}
                    likeBlog={handleLikeBlog}
                    removeBlog={handleRemoveBlog}
                  />
                </SectionCard>
              ) : <MetaText>blog not found</MetaText>
            }
          />
          <Route
            path="/new"
            element={
              user ? (
                <FormCard>
                  <PageTitle>create new</PageTitle>
                  <MetaText>Share a new read with the rest of the group.</MetaText>
                  <div style={{ height: 18 }} />
                  <BlogForm createBlog={handleCreateBlog} />
                </FormCard>
              ) : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </ContentWrap>
    </PageShell>
  )
}

export default App
