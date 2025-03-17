import React, { useState } from 'react'; 
import axios from 'axios'; 
function Register() { 
const [form, setForm] = useState({ name: '', email: '', password: '', address: '' }); 
const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); 
const handleSubmit = async (e) => { 
e.preventDefault(); 
await axios.post('http://localhost:3000/register', form); 
alert('Registration successful!'); 
}; 
return ( 
<form onSubmit={handleSubmit}> 
<input type="text" name="name" placeholder="Name" onChange={handleChange} required /> 
<input type="email" name="email" placeholder="Email" onChange={handleChange} required /> 
<input type="password" name="password" placeholder="Password" onChange={handleChange} 
required /> 
<input type="text" name="address" placeholder="Address" onChange={handleChange} required /> 
<button type="submit">Register</button> 
</form> 
); 
} 
export default Register; 