import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import DashboardSkeleton from './components/DashboardSkeleton';
import HomeLayout from './layout/HomeLayout';

function App() {
  axios.defaults.baseURL = "https://airline-7lh1.onrender.com/api/v1";
  axios.defaults.params = {};
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="" element={<Auth />} />
        <Route path='/' element={<HomeLayout />}>
          <Route path="/home" element={<DashboardSkeleton />} />
          <Route path='*' element={<h1>No content</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
