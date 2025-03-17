import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
 
function Dashboard() { 
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 }); 
 
  useEffect(() => { 
    const fetchStats = async () => { 
      const token = localStorage.getItem('token'); 
      const response = await axios.get('http://localhost:3000/dashboard/stats', { 
        headers: { Authorization: `Bearer ${token}` } 
      }); 
      setStats(response.data); 
    }; 
    fetchStats(); 
  }, []); 
 
  return ( 
    <div> 
      <h2>Dashboard</h2> 
      <p>Total Users: {stats.users}</p> 
      <p>Total Stores: {stats.stores}</p> 
<p>Total Ratings: {stats.ratings}</p> 
</div> 
); 
} 
export default Dashboard;