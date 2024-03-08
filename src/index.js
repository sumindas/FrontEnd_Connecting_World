import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals'; 
import { PersistGate } from 'redux-persist/integration/react';
import {store,persistor} from './Redux/Store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading ={null} persistor={persistor}>
          <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
  
    
);


reportWebVitals();
