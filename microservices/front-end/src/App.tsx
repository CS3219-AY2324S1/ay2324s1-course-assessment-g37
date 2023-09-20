// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import QuestionBank from './components/QuestionBank'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/login" element = {<LoginPage/>} />
        <Route path='/question-bank' element = {<QuestionBank/> } />
        <Route path = "/signup" element = {<SignupPage /> } />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Catch-all route */}
      </Routes>
    </Router>
  )
}

export default App
