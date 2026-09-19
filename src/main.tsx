import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupAssetRecoveryListener } from './lib/versionManager.ts';

// Initialize resilient chunk failure listener to catch deployment updates
// without wiping out the user's contingent session or requiring IC re-activation
setupAssetRecoveryListener();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
