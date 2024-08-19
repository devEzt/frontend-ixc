import { BrowserRouter, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom'
import { ChatPage, LoginPage, RegisterPage } from './pages'

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </RouterRoutes>
    </BrowserRouter>
  )
}

export default Routes
