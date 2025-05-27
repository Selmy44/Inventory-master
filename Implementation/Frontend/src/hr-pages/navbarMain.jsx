import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Centrika from '../images/centrika-removebg.png';
import AccountIcon from '../images/accountSVG.svg';
import axios from 'axios';
import PolicySVG from '../images/policySVG.svg';
import Modal from 'react-modal';
import Select from 'react-select';
import Keys from '../keys';
import Leave from '../images/leave.svg'
import PersonalInfo from '../images/personalAttendee.svg'

function NavbarMain() {
    const color = {
        color: 'green'
    };

    const url = Keys.REACT_APP_BACKEND;


    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const modalStyles = {
        content: {
            top: '18%',
            width: '20%',
            left: '20%',
            right: 'auto',
            gap: '12px',
            borderRadius: '12px',
            height: '25%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.9,
            fontFamily: 'Your Custom Font, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            color: 'white',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const fetchData = async () => {
            const EmpID = localStorage.getItem("userID");
            try {
                if (EmpID) {
                    const response = await axios.get(`${url}/employee-once/${EmpID}`);
                    setData(response.data[0]);
                } else {
                    console.error("EmpID Not found in localStorage")
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchData();
    }, []);

    const option = [
        { value: 'item', label: "Item Request" },
        { value: 'purchase', label: "Purchase Request" },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            color: 'white',
            border: 'none',
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center'
        }),
        option: (provided) => ({
            ...provided,
            backgroundColor: 'black',
            display: 'flex',
            '&:hover': {
                backgroundColor: 'lightgrey',
                color: 'black'
            }
        }),
        singleValue: (provided) => ({
            ...provided,
            width: '100%',
            height: '24px',
            display: 'flex',
            marginLeft: '10px',
            alignItems: 'center',
            backgroundColor: 'black',
            color: 'white',
        })
    };

    const [selectedRequest, setSelectedRequest] = useState(null);


    const handleRequestChange = (event) => {
        setSelectedRequest(event.value);
    };

    useEffect(() => {
        const changeRequest = (selectedRequest) => {
            if (selectedRequest === 'item') {
                navigate('/request-hr');
            } else if (selectedRequest === 'purchase') {
                navigate('/purchase-hr');
            };
        }

        changeRequest(selectedRequest);
    }, [selectedRequest])

    const [transactionType, setTransactionType] = useState('');


    const handleTransactionChange = (event) => {
        const selectedTransactionType = event.target.value;
        setTransactionType(event.target.value);

        if (selectedTransactionType === "item") {
            navigate('/notification-hr')
        } else if (selectedTransactionType === "leave"){
            navigate('/leave-notification-hr')
        }else {
            navigate('/purchase-notification-hr')
        }

    };

    const select = {
        width: '209px',
        color: 'white',
        display: 'block',
        padding: '8px 16px',
        borderRadius: '12px',
        color: 'white',
        marginTop: '4px',
        textDecoration: 'none',
        backgroundColor: 'black',
        float: 'right',
        justifyContent: 'center'
    };


    return (
        <div className="navbar">

            <ul className='ul1' style={color}>
                <li style={{ float: 'left',  marginTop: '-5px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Notifications</option>
                    <option value="item" >Item</option>
                    <option value="purchase" >Purchase</option>
                    <option value="leave" >Leave</option>
                </select>
                <li className='li1'><Link to={'/home-hr'}>Home</Link></li>
            </ul>

            <ul className='ul2Admin'>
                <li className='liAdmin'><Link to={'/account-hr'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li>
                <li className='liAdmin'><Link to={'/leave-page'} ><img src={Leave} style={{ maxWidth: '18%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Leave</p></Link></li>
                <li className='liAdmin'><Link to={'/onboard'} > <img src={PersonalInfo} style={{ maxWidth: '18%', maxHeight: '50vh' }} /> <p>Employee Personal File</p></Link></li>
                <Select
                    options={option}
                    styles={customStyles}
                    placeholder="Request"
                    onChange={handleRequestChange}
                />
                <li className='liAdmin'><Link to={'/terms-hr'}><img src={PolicySVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Terms and Conditions</p></Link></li>
            </ul>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
                {data && (
                    <>
                        <p>Username: {data.username}</p>
                        <p>Password: {data.password}</p>
                        <p>Position: {data.role_name}</p>
                        <p>Department: {data.department_name}</p>
                    </>
                )}
            </Modal>
        </div>
    );
}

export default NavbarMain;
