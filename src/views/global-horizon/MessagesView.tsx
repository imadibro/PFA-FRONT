'use client'

import { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useGetMessageThreadsQuery, useSendMessageMutation } from '@/store/features/message/messageApi'

const MessagesView = () => {
  const { data: threads = [], isLoading } = useGetMessageThreadsQuery()
  const [sendMessage] = useSendMessageMutation()

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')

  const selectedThread = threads.find(t => t.id === selectedThreadId)

  const handleSendMessage = async () => {
    if (!selectedThreadId || !messageText.trim()) return

    try {
      await sendMessage({ threadId: selectedThreadId, text: messageText }).unwrap()
      setMessageText('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155', mb: 0.5 }}>
        Messages
      </Typography>
      <Typography variant='body2' sx={{ color: '#747782', mb: 3 }}>
        Chat with hosts and concierge services
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: 2, height: '600px' }}>
        {/* Threads List */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e0e3e6',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e3e6' }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
              Conversations ({threads.length})
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {threads.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <i className='tabler-message-off' style={{ fontSize: 48, color: '#e0e3e6' }} />
                <Typography variant='body2' sx={{ color: '#747782', mt: 2 }}>
                  No messages yet
                </Typography>
              </Box>
            ) : (
              threads.map(thread => (
                <Box
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: selectedThreadId === thread.id ? '#f7f9fc' : 'transparent',
                    borderLeft: selectedThreadId === thread.id ? '3px solid #002155' : '3px solid transparent',
                    '&:hover': { bgcolor: '#f7f9fc' },
                    transition: 'all 0.2s'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'start' }}>
                    <Badge badgeContent={thread.unreadCount} color='error'>
                      <Avatar src={thread.hostAvatar} sx={{ width: 48, height: 48 }} />
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 0.5 }}>
                        {thread.hostName}
                      </Typography>
                      <Typography variant='caption' sx={{ color: '#747782', display: 'block', mb: 0.5 }}>
                        {thread.propertyTitle}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{
                          color: '#434651',
                          fontSize: 13,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {thread.lastMessage}
                      </Typography>
                      <Typography variant='caption' sx={{ color: '#747782', mt: 0.5, display: 'block' }}>
                        {thread.lastMessageTime}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Paper>

        {/* Chat Area */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e0e3e6',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {!selectedThread ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#f7f9fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <i className='tabler-message-circle' style={{ fontSize: 40, color: '#002155' }} />
              </Box>
              <Typography variant='h6' sx={{ fontWeight: 700, color: '#002155', mb: 1 }}>
                Select a conversation
              </Typography>
              <Typography variant='body2' sx={{ color: '#747782', textAlign: 'center' }}>
                Choose a thread from the list to start chatting
              </Typography>
            </Box>
          ) : (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e3e6', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedThread.hostAvatar} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
                    {selectedThread.hostName}
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#747782' }}>
                    {selectedThread.propertyTitle}
                  </Typography>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedThread.messages.map(msg => {
                  const isUser = msg.isUser

                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          bgcolor: isUser ? '#002155' : '#f7f9fc',
                          color: isUser ? '#fff' : '#191c1e',
                          p: 2,
                          borderRadius: 2,
                          borderTopRightRadius: isUser ? 0 : 2,
                          borderTopLeftRadius: isUser ? 2 : 0
                        }}
                      >
                        <Typography variant='body2' sx={{ mb: 0.5 }}>
                          {msg.text}
                        </Typography>
                        <Typography variant='caption' sx={{ opacity: 0.7 }}>
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: '1px solid #e0e3e6', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size='small'
                  placeholder='Type your message...'
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  sx={{
                    bgcolor: '#002155',
                    color: '#fff',
                    '&:hover': { bgcolor: '#003580' },
                    '&:disabled': { bgcolor: '#e0e3e6', color: '#747782' }
                  }}
                >
                  <i className='tabler-send' />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default MessagesView
