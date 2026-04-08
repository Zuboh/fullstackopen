import styled from 'styled-components'

const Banner = styled.div`
  margin-bottom: 18px;
  padding: 14px 18px;
  border-radius: 18px;
  border: 1px solid rgba(33, 53, 71, 0.14);
  background: linear-gradient(135deg, rgba(255, 247, 231, 0.96), rgba(227, 241, 234, 0.92));
  color: #213547;
  font-weight: 700;
  box-shadow: 0 10px 22px rgba(33, 53, 71, 0.08);
`

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <Banner>
      {message}
    </Banner>
  )
}

export default Notification
