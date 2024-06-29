import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import DashboardSkeleton from './components/DashboardSkeleton';

function App() {
  axios.defaults.baseURL = "https://localhost:8080/api/v1";
  axios.defaults.params = {};
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/home" element={<DashboardSkeleton/>} />
        <Route path="" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
