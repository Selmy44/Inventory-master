import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Centrika from '../images/centrika-removebg.png';

function Home3() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };
    return (
        <div >
            <ul className='ul1-hr-home' >
                <li style={{ float: 'left', marginLeft: '13px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
                <li className='li1'><Link to={'/notification-hr'}>Requests</Link></li>
                <li className='li1'><Link to={'/home-hr'}>Home</Link></li>
            </ul>
        </div>
    );
}

export default Home3;
