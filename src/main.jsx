import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import "./router/index.css";
import AppRouter from './router/app';

const root = createRoot(document.getElementById("root"))
root.render(<StrictMode><AppRouter/></StrictMode>)
