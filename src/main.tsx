import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CompletePayment from './CompletePayment.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/completePayment" element={<CompletePayment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
