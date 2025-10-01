import CryptoJS from 'crypto-js'

// Secret key for encryption - in production, use environment variable
const SECRET_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || 'your-secret-key-change-in-production'

// Encrypt data
const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return null
  }
}

// Decrypt data
const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

// Set encrypted cookie
export const setEncryptedCookie = (name, value, days = 7) => {
  try {
    const encryptedValue = encrypt(value)
    if (!encryptedValue) return false

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    document.cookie = `${name}=${encryptedValue}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
    return true
  } catch (error) {
    console.error('Error setting encrypted cookie:', error)
    return false
  }
}

// Get and decrypt cookie
export const getEncryptedCookie = (name) => {
  try {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        const encryptedValue = c.substring(nameEQ.length, c.length)
        return decrypt(encryptedValue)
      }
    }
    return null
  } catch (error) {
    console.error('Error getting encrypted cookie:', error)
    return null
  }
}

// Delete cookie
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Clear all auth-related cookies
export const clearAuthCookies = () => {
  deleteCookie('bearerToken')
  deleteCookie('userData')
  deleteCookie('userRole')
}
