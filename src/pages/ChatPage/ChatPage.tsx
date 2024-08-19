import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Grid,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material'

import * as S from './styles'

const socket = io('http://localhost:5000')

interface Message {
  content: string
  sender: string
  receiver: string
  _id: string
}

interface User {
  _id: string
  name: string
}

interface Conversation {
  userId: string
  name: string
  lastMessage: string
}

const getMessageStyle = (isSender: boolean): React.CSSProperties => ({
  textAlign: isSender ? 'right' : 'left',
  backgroundColor: isSender ? '#e0f7fa' : '#ffffff',
  padding: '8px',
  borderRadius: '10px',
  margin: '5px',
  maxWidth: '80%',
  width: 'fit-content',
  border: isSender ? '2px solid #aed581' : '2px solid #e1bee7',
})

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [showUsers, setShowUsers] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    socket.on('newMessage', (message: Message) => {
      if (message.receiver === selectedUser || message.sender === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    })

    return () => {
      socket.off('newMessage')
    }
  }, [selectedUser])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('http://localhost:5000/api/users')
      setUsers(data.filter((user: User) => user._id !== localStorage.getItem('userId')))
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/messages/conversations/${localStorage.getItem('userId')}`
        )
        console.log('Conversas recebidas:', data)
        setConversations(data)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      }
    }

    fetchConversations()
  }, [])

  const sendMessage = async () => {
    if (input.trim() && selectedUser) {
      const message = {
        content: input,
        sender: localStorage.getItem('userId')!,
        receiver: selectedUser,
      }

      const { data } = await axios.post('http://localhost:5000/api/messages', message)
      socket.emit('messageSent', data.newMessage)
      setInput('')
    }
  }

  const selectUser = async (userId: string) => {
    setSelectedUser(userId)
    const response = await axios.get(`http://localhost:5000/api/messages/${localStorage.getItem('userId')}/${userId}`)
    setMessages(response.data)
  }

  const handleNewMessageClick = () => setShowUsers(!showUsers)

  return (
    <S.StyledContainer maxWidth="lg" sx={{ height: '100vh' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={4}>
          <S.StyledPaper elevation={3}>
            <Button variant="contained" fullWidth color="primary" onClick={handleNewMessageClick}>
              Nova Mensagem
            </Button>
            {showUsers ? (
              <List sx={{ maxHeight: '100%', overflowY: 'auto' }}>
                {users.map((user) => (
                  <ListItem button onClick={() => selectUser(user._id)} key={user._id}>
                    <ListItemAvatar>
                      <Avatar>{user.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {conversations.map((conv) => (
                  <ListItem button onClick={() => selectUser(conv.userId)} key={conv.userId}>
                    <ListItemAvatar>
                      <Avatar>{conv.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={conv.name} secondary={conv.lastMessage} />
                  </ListItem>
                ))}
              </List>
            )}
          </S.StyledPaper>
        </Grid>
        <Grid item xs={8} sx={{ height: '100%' }}>
          <S.StyledPaper elevation={3} sx={{ overflow: 'hidden' }}>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {selectedUser ? ` ${users.find((u) => u._id === selectedUser)?.name}` : 'Selecione um usuário'}
                </Typography>
              </Toolbar>
            </AppBar>
            <List sx={{ maxHeight: '75vh', overflow: 'auto' }}>
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  style={{ justifyContent: msg.sender === localStorage.getItem('userId') ? 'flex-end' : 'flex-start' }}
                >
                  <Paper style={getMessageStyle(msg.sender === localStorage.getItem('userId'))}>
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {msg.sender === localStorage.getItem('userId')
                        ? 'Você'
                        : users.find((u) => u._id === msg.sender)?.name}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
            {selectedUser && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                sx={{ display: 'flex', alignItems: 'center', p: 2 }}
              >
                <TextField
                  label="Digite sua mensagem aqui"
                  fullWidth
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  sx={{ mr: 2 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Enviar
                </Button>
              </Box>
            )}
          </S.StyledPaper>
        </Grid>
      </Grid>
    </S.StyledContainer>
  )
}
