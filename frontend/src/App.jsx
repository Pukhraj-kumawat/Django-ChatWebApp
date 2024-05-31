import { useState, useEffect } from 'react'
import AuthPage from './components/auth'
import Home from './components/home'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import WebSocketInstance from '../services/websocket';

function App() {

const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwt_token'));

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setJwtToken(token);
    }
  }, []);


  return (
  <>
  
  <BrowserRouter>
      <Routes> 
        {!jwtToken && (
          <Route path="/*" element={<Navigate to="/" />} />
        )}

        {jwtToken ? (
          <Route path="/" element = {<Home jwtToken = {jwtToken}/>}></Route>
        ):(
          <Route path="/" element={<AuthPage />}></Route>   
        )}    
                                
      </Routes>
  </BrowserRouter>
  
  </>
  )
}

export default App
