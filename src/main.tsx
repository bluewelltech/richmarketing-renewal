import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './refinements.css';

// Block native selection/drag menus while preserving controls and pointer-based carousels.
const isEditable = (target: EventTarget | null) => target instanceof Element && !!target.closest('input, textarea, [contenteditable="true"]');
for (const type of ['contextmenu', 'selectstart', 'dragstart']) {
  document.addEventListener(type, event => {
    if (!isEditable(event.target)) event.preventDefault();
  });
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
