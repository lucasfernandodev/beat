import './styles/global.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router';
import { PageHome } from './pages/home';
import { PageSettings } from './pages/settings';
import { PageNotFound } from './pages/notfound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PatientPressureOverview } from './pages/patient-pressure-overview';



const queryClient = new QueryClient();

const root = document.getElementById("root");
ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageHome />} />
          <Route path="/settings" element={<PageSettings />} />
          <Route path='/pressure/:username' element={<PatientPressureOverview />} />
          <Route path={"/*"} element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);