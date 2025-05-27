import React, { useState } from 'react';
import User from '../images/user.svg';
import Navbar from './navbar';
import Request from '../images/request.svg';
import Notification from '../images/notification.svg';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Keys from '../keys';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const url = Keys.REACT_APP_BACKEND;


    useEffect(() => {
        axios.get(`${url}/home-employee`)
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);
                } else {
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
    }, [])
    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        width: '10%',
        display: 'flex',
        marginLeft: '220px',
        color: 'black'
    }
    const start = {
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgb(163, 187, 197)'
    }
    return (
        <div style={start}>
            <Navbar></Navbar>
            <div>
                <h1 style={kain}>Dashboard</h1>
                <div className="icon-container">
                    <div className="icons">
                        <img className='img1' src={User} alt='img1' />
                        <p>Account: {name}</p>
                    </div>
                    <div className="icons1">
                        <img className='img1' src={Request} alt='img2' />
                        <p>Requests: ---</p>
                    </div>
                    <div className="iconsx2">
                        <img className='img1' src={Notification} alt='img3' />
                        <p>Notifications: ---</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
