import { useState } from 'react'
import {
  Button,
  ButtonRow,
  FieldGroup,
  FieldInput,
  FieldLabel,
  StyledForm,
} from './ui'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url,
    }

    const created = await createBlog(blogObject)

    if (created) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FieldGroup>
        <FieldLabel htmlFor="title">title</FieldLabel>
        <FieldInput
          id="title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel htmlFor="author">author</FieldLabel>
        <FieldInput
          id="author"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel htmlFor="url">url</FieldLabel>
        <FieldInput
          id="url"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </FieldGroup>
      <ButtonRow>
        <Button type="submit">create</Button>
      </ButtonRow>
    </StyledForm>
  )
}

export default BlogForm
