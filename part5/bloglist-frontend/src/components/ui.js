import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const PageShell = styled.div`
  min-height: 100vh;
  padding: 32px 20px 56px;
  background:
    radial-gradient(circle at top left, rgba(255, 204, 112, 0.32), transparent 28%),
    radial-gradient(circle at top right, rgba(82, 182, 154, 0.18), transparent 26%),
    linear-gradient(180deg, #fffaf0 0%, #f5efe2 100%);
  color: #2f2a24;
`

export const ContentWrap = styled.div`
  max-width: 980px;
  margin: 0 auto;
`

export const NavigationBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 22px;
  border-radius: 22px;
  background: linear-gradient(135deg, #213547 0%, #35576e 100%);
  box-shadow: 0 16px 32px rgba(33, 53, 71, 0.22);
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const NavLink = styled(Link)`
  padding: 10px 14px;
  border-radius: 999px;
  color: #fffaf0;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.08);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`

export const NavStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f7f0df;
  font-weight: 600;
`

export const PageTitle = styled.h2`
  margin: 0 0 18px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: #213547;
`

export const SectionCard = styled.section`
  padding: 26px;
  border: 1px solid rgba(33, 53, 71, 0.12);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 22px 48px rgba(65, 53, 34, 0.1);
  backdrop-filter: blur(10px);
`

export const FormCard = styled(SectionCard)`
  max-width: 560px;
`

export const StyledForm = styled.form`
  display: grid;
  gap: 16px;
`

export const FieldGroup = styled.div`
  display: grid;
  gap: 8px;
`

export const FieldLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #5b5245;
`

export const FieldInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(47, 42, 36, 0.14);
  border-radius: 16px;
  background: #fffdfa;
  color: #2f2a24;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:focus {
    outline: none;
    border-color: #de7c5a;
    box-shadow: 0 0 0 4px rgba(222, 124, 90, 0.16);
    transform: translateY(-1px);
  }
`

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`

export const Button = styled.button`
  padding: 11px 18px;
  border: none;
  border-radius: 999px;
  background: ${(props) => props.$variant === 'muted'
    ? '#e8dfd0'
    : props.$variant === 'danger'
      ? '#b94f35'
      : '#de7c5a'};
  color: ${(props) => props.$variant === 'muted' ? '#2f2a24' : '#fffaf0'};
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, filter 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(0.98);
  }
`

export const BlogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
`

export const BlogListItem = styled.li`
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(33, 53, 71, 0.1);
  box-shadow: 0 10px 20px rgba(33, 53, 71, 0.07);
`

export const BlogListLink = styled(Link)`
  display: block;
  padding: 18px 20px;
  color: #213547;
  text-decoration: none;
  font-weight: 700;

  &:hover {
    color: #b94f35;
  }
`

export const MetaText = styled.p`
  margin: 0;
  color: #5b5245;
  line-height: 1.6;
`
