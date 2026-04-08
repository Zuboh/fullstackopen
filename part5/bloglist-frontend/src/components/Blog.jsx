import styled from 'styled-components'
import { Button, ButtonRow, MetaText } from './ui'

const BlogCard = styled.article`
  padding: 24px;
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(246, 239, 225, 0.88));
  border: 1px solid rgba(33, 53, 71, 0.12);
  box-shadow: 0 18px 38px rgba(33, 53, 71, 0.12);
`

const BlogHeading = styled.div`
  margin-bottom: 18px;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  line-height: 1.2;
  color: #213547;
`

const DetailGrid = styled.div`
  display: grid;
  gap: 12px;
`

const UrlText = styled.a`
  color: #b94f35;
  text-decoration: none;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }
`

const AccentStat = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  margin-right: 10px;
  border-radius: 999px;
  background: #213547;
  color: #fffaf0;
  font-weight: 700;
`

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const canRemove = blog.user && user && blog.user.username === user.username
  const canLike = Boolean(user)

  return (
    <BlogCard className="blog">
      <BlogHeading>
        <strong>{blog.title}</strong> {blog.author}
      </BlogHeading>
      <DetailGrid className="blog-details">
        <div>
          <UrlText href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </UrlText>
        </div>
        <div>
          <AccentStat>likes {blog.likes}</AccentStat>
          {canLike && (
            <Button type="button" onClick={() => likeBlog(blog)}>
              like
            </Button>
          )}
        </div>
        <MetaText>added by {blog.user?.name ?? 'unknown user'}</MetaText>
        {canRemove && (
          <ButtonRow>
            <Button type="button" $variant="danger" onClick={() => removeBlog(blog)}>
              remove
            </Button>
          </ButtonRow>
        )}
      </DetailGrid>
    </BlogCard>
  )
}

export default Blog
