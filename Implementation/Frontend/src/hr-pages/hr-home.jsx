import { Link } from 'react-router-dom';
import '../style.css';
import React, { useState, useEffect } from 'react';
import Home3 from './NavbarHR';
// import Employees from '../images/employeesForDisplay.png'

function HomeHR() {

  const homeHrContainer = {
    fontFamily: 'Arial, sansSerif',
    width: '100%',
    height: '1%',
    display: 'flex',
    flexDirection: 'inline',
    margin: '0',
    justifyContent: 'right',
    overFlow: 'hidden',
    backgroundColor: 'rgb(141, 33, 136)'
  };

  const HomeHr = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  }

  const [getName, setGetName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('username');
    setGetName(name);

  }, [getName]);


  return (
    <div>
      <Home3></Home3>
      <div className='home-hr-container'>
        {/* <img src={Employees} alt='image' /> */}
        <h1>Welcome {getName}</h1>

      </div>
    </div>
  );
}

export default HomeHR;