import { Link } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Home2 from './home2';

function SupervisorNotifier() {

  const [getName, setGetName] = useState('')

  useEffect(()=>{
  const name = localStorage.getItem('username');
  setGetName(name);

  },[getName]);
  
  return (
    <div>
      <Home2></Home2>
    <div className="home-supervisor-container">
      <div className="home-supervisor">
        <h1>Welcome Supervisor {getName}</h1>
      </div>
    </div>
    </div>
  );
}

export default SupervisorNotifier;
