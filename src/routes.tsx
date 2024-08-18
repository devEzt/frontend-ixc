import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom'
import { LoginPage } from './pages'

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<LoginPage />} />
      </RouterRoutes>
    </BrowserRouter>
  )
}

export default Routes
