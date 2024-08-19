import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom'
import { ChatPage, LoginPage } from './pages'

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </RouterRoutes>
    </BrowserRouter>
  )
}

export default Routes
