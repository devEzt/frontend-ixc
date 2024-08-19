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
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import * as S from './styles'
import { Conversation, Message, User } from './types'
import { format } from 'date-fns' // Você precisará instalar esta biblioteca se ainda não o fez
import { getMessageStyle, stringToColor } from './utils'

const socket = io('https://backend-ixc-production.up.railway.app')

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [showUsers, setShowUsers] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const loggedUserId = localStorage.getItem('userId')
  const [loggedUserName, setLoggedUserName] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('https://backend-ixc-production.up.railway.app/api/users')
      const currentUser = data.find((user: User) => user._id === loggedUserId)
      setLoggedUserName(currentUser ? currentUser.name : '')
      setUsers(data.filter((user: User) => user._id !== loggedUserId))
    }

    fetchUsers()
  }, [loggedUserId])

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `https://backend-ixc-production.up.railway.app/api/messages/conversations/${loggedUserId}`
        )
        console.log('Conversas recebidas:', data)
        setConversations(data)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      }
    }

    fetchConversations()
  }, [loggedUserId])

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await axios.post('https://backend-ixc-production.up.railway.app/api/users/logout', { userId: loggedUserId })
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const sendMessage = async () => {
    if (input.trim() && selectedUser) {
      const message = {
        content: input,
        sender: loggedUserId!,
        receiver: selectedUser,
      }

      try {
        const { data } = await axios.post('https://backend-ixc-production.up.railway.app/api/messages', message)
        socket.emit('messageSent', data.newMessage)
        setInput('')

        const exists = conversations.some((conv) => conv.userId === selectedUser)
        if (!exists) {
          const newUser = users.find((user) => user._id === selectedUser)
          const newConversation = {
            userId: selectedUser,
            name: newUser ? newUser.name : 'Unknown User',
            lastMessage: message.content,
          }
          setConversations((prev) => [newConversation, ...prev])
        }
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const selectUser = async (userId: string) => {
    setSelectedUser(userId)
    const response = await axios.get(
      `https://backend-ixc-production.up.railway.app/api/messages/${loggedUserId}/${userId}`
    )
    setMessages(response.data)
  }

  const handleNewMessageClick = () => setShowUsers(!showUsers)

  return (
    <S.StyledContainer maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <S.StyledPaper elevation={3}>
            <Button variant="contained" fullWidth color="primary" onClick={handleNewMessageClick}>
              Nova Mensagem
            </Button>
            {showUsers ? (
              <List sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                {users.map((user) => (
                  <ListItem button onClick={() => selectUser(user._id)} key={user._id}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: user.status === 'online' ? stringToColor(user.name) : 'grey',
                        }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <List sx={{ overflow: 'auto' }}>
                {conversations.map((conv) => (
                  <ListItem button onClick={() => selectUser(conv.userId)} key={conv.userId}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: stringToColor(users.find((user) => user._id === conv.userId)?.name || ''),
                        }}
                      >
                        {conv.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conv.name}
                      secondary={
                        conv.lastMessage.length > 30 ? `${conv.lastMessage.substring(0, 30)}...` : conv.lastMessage
                      }
                    />
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
                {selectedUser && (
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: stringToColor(users.find((user) => user._id === selectedUser)?.name || ''),
                    }}
                  >
                    {users
                      .find((u) => u._id === selectedUser)
                      ?.name.charAt(0)
                      .toUpperCase()}
                  </Avatar>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {selectedUser ? (
                    <strong>{users.find((u) => u._id === selectedUser)?.name}</strong>
                  ) : (
                    'Selecione um usuário'
                  )}

                  {selectedUser && (
                    <Box
                      component="span"
                      sx={{
                        marginLeft: 2,
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor:
                            users.find((u) => u._id === selectedUser)?.status === 'online' ? 'green' : 'red',
                          marginRight: 1,
                        }}
                      />
                      {users.find((u) => u._id === selectedUser)?.status === 'online' ? 'Online' : 'Offline'}
                    </Box>
                  )}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: stringToColor(loggedUserName) }}>
                      {loggedUserName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      {loggedUserName}
                    </Typography>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>Perfil</MenuItem>
                    <MenuItem onClick={handleLogout}>Desconectar</MenuItem>
                  </Menu>
                </div>
              </Toolbar>
            </AppBar>

            <List sx={{ maxHeight: '75vh', overflow: 'auto' }}>
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  style={{ justifyContent: msg.sender === loggedUserId ? 'flex-end' : 'flex-start' }}
                >
                  <Paper style={getMessageStyle(msg.sender === loggedUserId)}>
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {msg.sender === loggedUserId ? 'Você' : users.find((u) => u._id === msg.sender)?.name}
                      {' - '}
                      {format(new Date(msg.timestamp), 'p')}
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
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: '#FFF',
                  borderTop: '1px solid #ccc',
                }}
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
