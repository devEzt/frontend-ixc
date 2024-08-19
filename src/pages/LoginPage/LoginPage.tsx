import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import * as S from './styles'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password })
      const { token, userId } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      navigate('/chat')
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <S.GlobalStyle>
      <S.StyledContainer>
        <S.StyledPaper>
          <Typography component="h1" variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
            Acesse sua conta
          </Typography>
          <Typography color="textSecondary" style={{ marginBottom: '30px' }}>
            Insira suas credenciais para fazer login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <S.StyledTextField
              fullWidth
              variant="outlined"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <S.StyledTextField
              fullWidth
              variant="outlined"
              label="Senha"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <S.LoginButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}
            >
              Acessar
            </S.LoginButton>
            <S.CreateAccountButton onClick={() => navigate('/register')}>Criar uma nova conta</S.CreateAccountButton>
          </Box>
        </S.StyledPaper>
      </S.StyledContainer>
    </S.GlobalStyle>
  )
}
