import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router, Route } from 'wouter';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <Router>
    <Route path="/" component={App} />
  </Router>
);
