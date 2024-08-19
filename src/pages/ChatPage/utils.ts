export const stringToColor = (string: string) => {
  let hash = 0
  let i

  for (i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}

export const getMessageStyle = (isSender: boolean): React.CSSProperties => ({
  textAlign: isSender ? 'right' : 'left',
  backgroundColor: isSender ? '#e0f7fa' : '#ffffff',
  padding: '8px',
  borderRadius: '10px',
  margin: '5px',
  maxWidth: '80%',
  width: 'fit-content',
  border: isSender ? '2px solid #aed581' : '2px solid #e1bee7',
})
