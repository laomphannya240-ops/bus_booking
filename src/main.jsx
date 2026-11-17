import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext'
import { DataProvider } from './context/DataContext'
import { BookingProvider } from './context/BookingContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <DataProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </DataProvider>
    </AppProvider>
  </StrictMode>,
)
