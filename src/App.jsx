import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Component/Login'
import Register from './Component/Register'
import Home from './Component/Home'
import { auth } from './Firebase/firebase'
import Success from './Pages/Success'
import cancel from './Pages/cancel'

function App() {
  const [User, setUser] = useState()


  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setUser(user);
    })
  }, [])

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/Login' element={ User ? <Navigate to={'/'} /> : <Login/>} >Login</Route>
      <Route path='/Register' element={<Register />} >Register</Route>
      <Route path='/' element={<Home />} >Home</Route>
      <Route path='/Success' element={<Success />} >SuccesPayment</Route>
      <Route path='/cancel' element={<cancel />} >cancel</Route>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
