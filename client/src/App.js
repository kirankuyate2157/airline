import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

function App() {
  axios.defaults.baseURL = "https://localhost:8080/api/v1";
  axios.defaults.params = {};
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="" element={<div>hiii</div>} />
        <Route path="auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
