const stripDangerousKeys = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else {
        stripDangerousKeys(obj[key])
      }
    }
  }
}

export const sanitizeInput = (req, res, next) => {
  stripDangerousKeys(req.body)
  stripDangerousKeys(req.params)
  next()
}