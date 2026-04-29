import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Handle GitHub Pages SPA redirect from 404.html ("?p=" query param)
(function (l) {
  if (!l.search) return;

  const params = new URLSearchParams(l.search.slice(1));
  const p = params.get('p');

  if (p === null) return;

  const decodedPath = p.replace(/~and~/g, '&');
  const q = params.get('q');
  const decodedQuery = q ? q.replace(/~and~/g, '&') : '';

  const newPathname = decodedPath.startsWith('/') ? decodedPath : `/${decodedPath}`;
  const newSearch = decodedQuery ? `?${decodedQuery}` : '';
  const newUrl = `${l.protocol}//${l.host}${newPathname}${newSearch}${l.hash}`;

  window.history.replaceState(null, '', newUrl);
})(window.location);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
