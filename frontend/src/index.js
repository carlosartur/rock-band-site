import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { CsrfProvider } from './admin/context/CsrfContext';
import { ThemeProvider, useTheme } from '@material-tailwind/react';
//import { Button } from "@material-tailwind/react";

const initialState = {
  sidebarShow: true,
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(changeState);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CsrfProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CsrfProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
