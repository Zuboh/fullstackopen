import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'The Joel Test',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
    likes: 5,
    user: {
      id: '123',
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  const creatorUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
  }

  const otherUser = {
    username: 'otheruser',
    name: 'Other User',
  }

  test('shows blog info and likes to logged out users, but not buttons', () => {
    render(
      <Blog blog={blog} user={null} likeBlog={() => {}} removeBlog={() => {}} />
    )

    expect(screen.getByText('The Joel Test')).toBeInTheDocument()
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })

  test('shows like button but not remove button to authenticated non-creator', () => {
    render(
      <Blog blog={blog} user={otherUser} likeBlog={() => {}} removeBlog={() => {}} />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })

  test('shows remove button to creator and calls like handler twice', async () => {
    const likeBlog = vi.fn()
    const userAction = userEvent.setup()

    render(
      <Blog blog={blog} user={creatorUser} likeBlog={likeBlog} removeBlog={() => {}} />
    )

    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
    const likeButton = screen.getByRole('button', { name: 'like' })
    await userAction.click(likeButton)
    await userAction.click(likeButton)

    expect(likeBlog).toHaveBeenCalledTimes(2)
  })
})
