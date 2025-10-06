import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { ToasterProvider } from 'common/Toaster'
import { SpinnerProvider } from 'common/SpinnerLoader'
import { ThemeProvider } from './contexts/ThemeContext'
import { DialogProvider } from 'contexts/DialogProvider'
import Dialog from 'components/dialog/Dialog'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <ChakraProvider value={defaultSystem}>
    <BrowserRouter>
      <SpinnerProvider>
        <ToasterProvider>
          <ThemeProvider>
            <DialogProvider>
              <App />
              <Dialog />
            </DialogProvider>
          </ThemeProvider>
        </ToasterProvider>
      </SpinnerProvider>
    </BrowserRouter>
  </ChakraProvider>
)
