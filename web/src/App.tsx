import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage }  from './pages/LandingPage';
import { LoginPage }    from './pages/LoginPage';
import { GamePage }     from './pages/GamePage';
import { GameOverPage } from './pages/GameOverPage';
import { useSettingsStore } from './store/settingsStore';
import { useAuthStore }     from './store/authStore';
import './App.css';

function App() {
  const darkMode = useSettingsStore((s) => s.darkMode);
  const init     = useAuthStore((s) => s.init);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />}  />
        <Route path="/login"    element={<LoginPage />}    />
        <Route path="/play"     element={<GamePage />}     />
        <Route path="/gameover" element={<GameOverPage />} />
        {/* Redirect any unknown path to home */}
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
