import React, { useState } from 'react'
import { Box, Typography, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import * as S from './styles'

export const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post('https://backend-ixc-production.up.railway.app/api/users', {
        name,
        email,
        password,
      })
      navigate('/login')
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <S.StyledContainer>
      <S.StyledPaper>
        <Typography component="h1" variant="h5" style={{ fontWeight: 'bold' }}>
          Crie sua conta
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
          <S.StyledTextField
            fullWidth
            variant="outlined"
            label="Nome"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <S.StyledTextField
            fullWidth
            variant="outlined"
            label="E-mail"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <S.StyledTextField
            fullWidth
            variant="outlined"
            label="Senha"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <S.ActionButton type="submit" fullWidth variant="contained" color="primary" endIcon={<ArrowForwardIosIcon />}>
            Registrar
          </S.ActionButton>
          <Link href="/login" variant="body2" sx={{ mt: 2, textDecoration: 'none', cursor: 'pointer', color: 'blue' }}>
            Já tem uma conta? Entrar
          </Link>
        </Box>
      </S.StyledPaper>
    </S.StyledContainer>
  )
}
