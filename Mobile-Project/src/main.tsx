
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Add dark mode class detection
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDarkMode) {
  document.documentElement.classList.add("dark");
}

createRoot(rootElement).render(<App />);
