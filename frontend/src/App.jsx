import { useState } from 'react'
import AuthPage from './components/auth'
import Home from './components/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)


  return (
  <>
  
  <BrowserRouter>
      <Routes>
          <Route path="/home" element = {<Home />}></Route>

          <Route path="" element={<AuthPage />}></Route>
        
      </Routes>
  </BrowserRouter>
  
  </>
  )
}

export default App
