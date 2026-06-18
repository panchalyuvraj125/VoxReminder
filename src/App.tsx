import { Routes, Route } from 'react-router-dom';
import Hero from './components/landing/Hero';
import VoxRemindApp from './components/app/VoxRemindApp';
import { ToastProvider } from './components/app/Toast';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/app" element={<VoxRemindApp />} />
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  );
}
