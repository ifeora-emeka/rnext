import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import './index.css'
import App from './App.tsx'
import Providers from "@/components/Providers.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DashboardLayout/>}>
                        <Route index element={<App />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Providers>
    </StrictMode>,
)
