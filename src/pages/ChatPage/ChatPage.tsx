import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import {
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Grid,
  Divider,
} from '@mui/material'

import { CSSProperties } from 'react'
interface Message {
  content: string
  sender: string
  receiver: string
}

interface User {
  _id: string
  name: string
}

const socket = io('http://localhost:5000')

const getMessageStyle = (isSender: boolean): CSSProperties => ({
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

  useEffect(() => {
    socket.on('newMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      socket.off('newMessage')
    }
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('http://localhost:5000/api/users')
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const sendMessage = async () => {
    if (input.trim() && selectedUser) {
      const sender = localStorage.getItem('userId')
      const message = {
        content: input,
        sender,
        receiver: selectedUser,
      }

      try {
        const { data } = await axios.post('http://localhost:5000/api/messages', message)
        setMessages((prevMessages) => [...prevMessages, data.newMessage])
        setInput('')
        socket.emit('messageSent', data.newMessage)
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  const selectUser = async (userId: string) => {
    setSelectedUser(userId)
    const senderId = localStorage.getItem('userId')
    if (senderId && userId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${senderId}/${userId}`)
        setMessages(response.data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ maxHeight: 500, overflow: 'auto' }}>
            <List>
              {users.map((user) => (
                <ListItem button onClick={() => selectUser(user._id)} key={user._id}>
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper elevation={3} sx={{ maxHeight: 500, overflow: 'auto' }}>
            <Typography variant="h4" sx={{ p: 2 }}>
              {selectedUser
                ? `Chat with ${users.find((u) => u._id === selectedUser)?.name}`
                : 'Select a user to start chatting'}
            </Typography>
            <Divider />
            <List>
              {messages.map((msg, index) => {
                const isSender = msg.sender === localStorage.getItem('userId')
                return (
                  <ListItem key={index} style={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
                    <Paper style={getMessageStyle(isSender)}>
                      <Typography variant="body1">{msg.content}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {isSender ? 'You' : users.find((u) => u._id === msg.sender)?.name}
                      </Typography>
                    </Paper>
                  </ListItem>
                )
              })}
            </List>

            {selectedUser && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage()
                }}
                style={{ display: 'flex', padding: '20px' }}
              >
                <TextField
                  label="Type your message"
                  fullWidth
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                  Send
                </Button>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
