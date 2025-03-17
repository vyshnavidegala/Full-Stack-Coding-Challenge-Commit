import React from 'react'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Register from './components/Register'; 
import Login from './components/Login'; 
import Stores from './components/Stores'; 
import Dashboard from './components/Dashboard'; 
function App() { 
return ( 
<Router> 
<Routes> 
<Route path="/register" element={<Register />} /> 
<Route path="/login" element={<Login />} /> 
<Route path="/stores" element={<Stores />} /> 
<Route path="/dashboard" element={<Dashboard />} /> 
</Routes> 
</Router> 
); 
} 
export default App; 
