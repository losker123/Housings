import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './Store/UserStore';
import HousingStore from './Store/HousingStore';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const Context = createContext(null);

root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      housing: new HousingStore()
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);