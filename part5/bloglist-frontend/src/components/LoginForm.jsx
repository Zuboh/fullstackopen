import {
  Button,
  ButtonRow,
  FieldGroup,
  FieldInput,
  FieldLabel,
  StyledForm,
} from './ui'

const LoginForm = ({
  handleSubmit,
  username,
  password,
  setUsername,
  setPassword,
}) => (
  <StyledForm onSubmit={handleSubmit}>
    <FieldGroup>
      <FieldLabel htmlFor="username">username</FieldLabel>
      <FieldInput
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </FieldGroup>
    <FieldGroup>
      <FieldLabel htmlFor="password">password</FieldLabel>
      <FieldInput
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </FieldGroup>
    <ButtonRow>
      <Button type="submit">login</Button>
    </ButtonRow>
  </StyledForm>
)

export default LoginForm
