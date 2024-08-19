import { Button, Container, Paper, styled, TextField } from '@mui/material'

export const GlobalStyle = styled('div')({
  boxSizing: 'border-box',
  height: '100%',
  width: '100%',
})

export const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  minWidth: '100vw',
  backgroundImage: 'linear-gradient(180deg, #6a11cb 0%, #2575fc 100%)',
})

export const StyledPaper = styled(Paper)({
  padding: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '15px',
  backgroundColor: '#ffffffe0',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
})

export const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'purple',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'purple',
    },
  },
  marginBottom: '20px',
})

export const LoginButton = styled(Button)({
  padding: '10px 20px',
  fontSize: '16px',
  margin: '20px 0',
})

export const CreateAccountButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#ffffff',
  color: 'blue',
  '&:hover': {
    backgroundColor: 'lightblue',
    color: 'darkblue',
  },
  width: '100%',
  textTransform: 'none',
  fontWeight: 'bold',
})
