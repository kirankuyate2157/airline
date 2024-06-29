import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<div>hiii</div>}/>
        <Route path="auth" element={<Auth/>}/>
      </Routes>
    </div>
  );
}

export default App;
