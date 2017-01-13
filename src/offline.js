// see: http://man7.org/linux/man-pages/man2/accept.2.html#ERRORS
const offlineErrorCodes = [
  'EAI_AGAIN',
  'ENETDOWN',
  'EPROTO',
  'ENOPROTOOPT',
  'EHOSTDOWN',
  'ENONET',
  'EHOSTUNREACH',
  'EOPNOTSUPP',
  'ENETUNREACH',
]

export default offlineErrorCodes
