// import logo from './logo.svg';
import { Suspense } from 'react';
import './App.css';
import './app.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import MainLayout from './MainLayout';

function App() {
  const loading = (
    <div className='pt-3 text-center'>
      <div className='sk-spinner sk-spinner-pulse'></div>
    </div>
  );

  return (
    <div className="App d-flex justify-content-center align-items-center min-vh-100">
      <HashRouter>
        <Suspense fallback={loading}></Suspense>
        <Routes>
          <Route path='/admin/*' element={<AdminLayout />}/>
          <Route path='*' element={<MainLayout />}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
