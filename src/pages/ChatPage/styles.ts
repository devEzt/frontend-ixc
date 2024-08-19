import { Box, Container, Paper, styled } from '@mui/material'

// Estilos customizados
export const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

export const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 96px)', // Altura menos a altura do padding superior e inferior
  overflowY: 'auto', // Adiciona scroll vertical
}))

export const ChatBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
}))
