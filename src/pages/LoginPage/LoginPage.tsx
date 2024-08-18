import { useState } from 'react'
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event: any) => {
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      })
      const { token } = response.data
      localStorage.setItem('token', token)
      navigate('/chat')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
