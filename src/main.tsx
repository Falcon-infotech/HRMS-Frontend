import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store.ts';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>

      <App />
      <Toaster />
    </PersistGate>
  </Provider>
);
