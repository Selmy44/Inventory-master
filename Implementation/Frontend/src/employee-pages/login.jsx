import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import Keys from '../keys.js'
import Modal from 'react-modal';
import Cross from '../images/cross.svg'
import ScaleLoader from 'react-spinners/ScaleLoader'


const url = Keys.REACT_APP_BACKEND;

function Login() {

    const loginContainer = {
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgb(34, 41, 44)',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    };


    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    }

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            zIndex: '20',
            // alignItems: 'center',
            // opacity: 0, // Ensures overlay is present but transparent
            background: 'transparent',
        },
        content: {
            zIndex: '20',
            width: '25%',
            marginLeft: '495px',
            border: 'none',
            height: '100%',
            borderRadius: '12px',
            background: 'transparent',
            gap: '23px',
            marginTop: '-19px',
            padding: '12px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // alignItems: 'center',
        },
    };


    const login = {
        width: '27%',
        height: '56vh',
        backgroundColor: 'rgb(56, 59, 61)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        gap: '23px',
        display: 'flex',
        padding: '8px 0px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };


    useEffect(() => {
        const func = async () => {
            try {
                const response = await axios.get(`${url}/category`);
                // const serverUrl=process.env.REACT_APP_BACKEND;
                console.log("Response: ", url);
            } catch (error) {
                console.error("Error Occured: ", error)
            }
        }

        func();

    }, [])

    const username = useRef();
    const password = useRef();

    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [userNotFoundModal, setUserNotFoundModal] = useState(false);
    const navigate = useNavigate();

    const closeUserNotFoundModal = () => {
        setUserNotFoundModal(false);
    }

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    };

    axios.defaults.withCredentials = true;


    const handleSubmits = (event) => {
        setLoading(true);

        event.preventDefault();
        const data = {
            "username": values.username,
            "password": values.password
        };

        console.log("VALUES: ", values.password);
        console.log("KEYS: ", url);

        axios.post(`${url}/login`, data)
            .then(res => {
                if (res.data.Login) {
                    localStorage.setItem("username", username.current.value);
                    localStorage.setItem("password", password.current.value);
                    localStorage.setItem("userID", res.data.id);
                    localStorage.setItem("roleID", res.data.roleID);
                    localStorage.setItem("email", res.data.email);
                    const userRole = res.data.roleID;

                    switch (userRole) {
                        case 3:
                            navigate('/home-admin');
                            break;
                        case 2:
                            navigate('/home-employee');
                            break;
                        case 5:
                            navigate('/home-supervisor');
                            break;
                        case 6:
                            navigate('/home-hr');
                            break;
                        case 4:
                            navigate('/home-employee');
                            break;
                        default:
                            alert("Not found")
                    }

                } else {
                    setLoading(false);
                    setUserNotFoundModal(true);

                    setInterval(() => {
                        closeUserNotFoundModal();
                    }, 2700)
                }
            })
            .catch(err => console.log(err));
    }
    const button = {
        width: '55px',
        height: '18%',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '12px',
        backgroundColor: 'black',
    }
    return (
        <div style={loginContainer}>
            <form style={{ width: '100%', display: 'flex', justifyContent: 'center' }} method="POST">
                <div style={login}>
                    <h1>Login</h1>
                    <input placeholder='Username' type='text' className='inputTest' name='username' onChange={handleInput} ref={username} />
                    <input placeholder='Password' autocomplete="off" type='password' name='password' onChange={handleInput} ref={password} />
                    <button style={button} onClick={handleSubmits}>{
                        loading === true ? <ScaleLoader color={'white'} loading={loading} size={0.5} />
                            : <p>Enter</p>
                    }</button>
                </div>
            </form>

            <Modal isOpen={userNotFoundModal} onRequestClose={closeUserNotFoundModal} style={modal} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Cross} style={svgStyle} />
                        <p style={{ color: 'white' }}>User Not Found.</p>
                    </div>
                </div>
            </Modal>


        </div >
    );
}

export default Login;