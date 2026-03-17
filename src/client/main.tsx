import './styles/global.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router';
import { PageHome } from './pages/home';
import { PageSettings } from './pages/settings';
import { PageNotFound } from './pages/notfound';

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/settings" element={<PageSettings />} />
        <Route path={"/*"} element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);