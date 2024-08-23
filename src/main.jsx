import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { RoomProvider } from './context/RoomContext.jsx'
import { Home } from './page/Home.jsx'
import { Room } from './page/Room.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RoomProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </RoomProvider>
  </BrowserRouter>
)
