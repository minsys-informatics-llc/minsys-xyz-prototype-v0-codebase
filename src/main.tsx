import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {TalentPage} from './TalentPage.tsx';
import {Router} from './Router.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router home={<App />} talent={<TalentPage />} />
  </StrictMode>,
);
