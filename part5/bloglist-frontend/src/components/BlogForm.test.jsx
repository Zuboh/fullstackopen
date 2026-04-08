import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn().mockResolvedValue(true)
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Clean Code')
  await user.type(screen.getByLabelText('author'), 'Robert C. Martin')
  await user.type(screen.getByLabelText('url'), 'https://example.com/clean-code')
  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Clean Code',
    author: 'Robert C. Martin',
    url: 'https://example.com/clean-code',
  })
})
