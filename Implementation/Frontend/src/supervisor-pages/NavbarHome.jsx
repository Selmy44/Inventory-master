import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Centrika from '../images/centrika-removebg.png';
import AccountIcon from '../images/accountSVG.svg';
import PolicySVG from '../images/policySVG.svg';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select';
import Keys from '../keys';
import ItemSVG from '../images/item_SVG.svg';
import Coins from '../images/coins.svg';
import Notifiaction from '../images/notificationSVGX.svg'
import PalmTree from '../images/palm_tree.svg';

function NavbarHome() {

    const url = Keys.REACT_APP_BACKEND;

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

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
            backgroundColor: 'rgba(0, 0, 0, 0.0)', // Adjust the background color and opacity
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
    const color = {
        color: 'green'
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
                    // console.log("Data", response.data[0]);
                } else {
                    console.error("EmpID Not found in localStorage")
                }
            } catch (error) {
                console.error("Error", error);
            }
        };

        fetchData();
    }, []);

    const handleTransactionChange = (event) => {
        const selectedTransactionType = event.target.value;
        setTransactionType(selectedTransactionType);

        console.log("Selected Option: ", selectedTransactionType)

        if (selectedTransactionType === 'item') {
            navigate('/notification-supervisor')
        } else if (selectedTransactionType === 'leave') {
            navigate('/supervisor-leave-notifications');
        } else if (selectedTransactionType === 'purchase') {
            navigate('/purchase-supervisor')
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

    const option = [
        { value: 'item', label: <><img src={ItemSVG} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Item Request </> },
        { value: 'purchase', label: <><img src={Coins} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Purchase Request </> },
        { value: 'leave', label: <><img src={PalmTree} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Leave Request </> },
    ];

    const options = [
        { value: 'item', label: <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Item Notifications </> },
        { value: 'purchase', label: <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Purchase Notifications </> },
        { value: 'leave', label: <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Leave Notifications </> },
    ];

    const customStyles = {
        control: (provided) => ({
            ...provided,
            color: 'white',
            border: 'none',
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center'
        }),
        option: (provided) => ({
            ...provided,
            backgroundColor: 'black',
            display: 'flex',
            // justifyContent: 'center',
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
            alignItems: 'center',
            backgroundColor: 'black',
            color: 'white',
        })
    };

    const handleRequestChange = (event) => {
        setSelectedRequest(event.value);
    };

    const handleNotificationChange = (event) => {
        setSelectedNotification(event.value);
    };

    useEffect(() => {
        const changeNotifications = (selectedNotification) => {
            if (selectedNotification === 'item') {
                navigate('/purchase-review-supervisor');
            } else if (selectedNotification === 'purchase') {
                navigate('/purchase-notifications-supervisor');
            } else if (selectedNotification === 'leave') {
                navigate('/leave-notification-employee');
            };
        };
        changeNotifications(selectedNotification);
    }, [selectedNotification])


    useEffect(() => {
        const changeRequest = (selectedRequest) => {
            if (selectedRequest === 'item') {
                navigate('/request-supervisor');
            } else if (selectedRequest === 'purchase') {
                navigate('/purchase-request-supervisor');
            } else if (selectedRequest === 'leave') {
                navigate('/employee-leave-request');
            };
        };
        changeRequest(selectedRequest);
    }, [selectedRequest]);

    const li1 = {
        width: '99px',
        color: 'white',
        height: '82px',
        diplay: 'flex',
        float: 'right',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(8, 81, 26)',
    }

    const handle = {
        marginLeft: '300px',
    }

    return (
        <div className="navbar">
            <ul className='ul1-super' style={color}>
                <li style={{ float: 'left', marginTop: '-5px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li style={li1} onClick={handleLogout}><Link>Log Out</Link></li>
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Requests</option>
                    <option value='item' >Item</option>
                    <option value='purchase' >Purchase</option>
                    <option value='leave'> Leave</option>
                </select>
                <li style={li1} ><Link to={'/home-supervisor'}>Home</Link></li>
            </ul>
            <ul className='ul2supervisor'>
                <li className='liAdmin'><Link to={'/account-admin'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li>
                <Select
                    options={option}
                    styles={customStyles}
                    placeholder="Request Forms"
                    onChange={handleRequestChange}
                />
                {/* <li className='lisupervisor'><Link to={'/purchase-review-supervisor'}>Notifications</Link></li> */}
                <Select
                    options={options}
                    styles={customStyles}
                    placeholder="Notifications"
                    onChange={handleNotificationChange}
                />
                {/* <li className='lisupervisor'><Link to={'/transactions-supervisor'}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Transactions</p></Link></li> */}
                <li className='liAdmin'><Link to={'/terms-supervisor'}><img src={PolicySVG} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Terms and Conditions</p></Link></li>
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

export default NavbarHome;