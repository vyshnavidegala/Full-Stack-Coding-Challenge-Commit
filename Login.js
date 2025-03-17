import React, { useState } from 'react'; 
import axios from 'axios'; 
function Login() { 
const [form, setForm] = useState({ email: '', password: '' }); 
const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); 
const handleSubmit = async (e) => { 
e.preventDefault(); 
const res = await axios.post('http://localhost:3000/login', form); 
localStorage.setItem('token', res.data.token); 
alert('Login successful!'); 
}; 
return ( 
<form onSubmit={handleSubmit}> 
<input type="email" name="email" placeholder="Email" onChange={handleChange} required /> 
<input type="password" name="password" placeholder="Password" onChange={handleChange} 
required /> 
<button type="submit">Login</button> 
</form> 
); 
} 
export default Login; 