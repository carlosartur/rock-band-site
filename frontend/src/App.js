// import logo from './logo.svg';
import { Suspense } from 'react';
import './App.css';
import './app.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import MainLayout from './MainLayout';
import DefaultLayout from './admin/layout/DefaultLayout';
import Login from './admin/pages/Login';
import { AuthProvider } from './admin/context/AuthContext';

function App() {
  const loading = (
    <div className='pt-3 text-center'>
      <div className='sk-spinner sk-spinner-pulse'></div>
    </div>
  );

  return (
    <HashRouter>
      <Suspense fallback={loading}></Suspense>
      <Routes>
        <Route path='/admin/*' element={<DefaultLayout />}/>
        <Route path='/login' element={<AuthProvider><Login /></AuthProvider>}/>
        <Route path='*' element={<MainLayout />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
