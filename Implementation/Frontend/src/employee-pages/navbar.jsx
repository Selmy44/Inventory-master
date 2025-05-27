import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountIcon from '../images/accountSVG.svg';
import Modal from 'react-modal';
import Centrika from '../images/centrika-removebg.png';
import Select from 'react-select';
import PolicySVG from '../images/policySVG.svg';
import Keys from '../keys';
import ItemSVG from '../images/item_SVG.svg';
import Coins from '../images/coins.svg';
import Notifiaction from '../images/notificationSVGX.svg'
import PalmTree from '../images/palm_tree.svg';

function Navbar() {

  const url = Keys.REACT_APP_BACKEND;

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      zIndex: '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const EmpID = localStorage.getItem("userID");
      try {
        const response = await axios.get(`${url}/employee-once/${EmpID}`);
        setData(response.data[0]);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, [data]);


  const option = [
    { value: 'item', label: <><img src={ItemSVG} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Item Request </>},
    { value: 'purchase', label:  <><img src={Coins} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Purchase Request </> },
    { value: 'leave', label:  <><img src={PalmTree} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Leave Request </> },
  ];

  const options = [
    { value: 'item', label:  <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Item Notifications </> },
    { value: 'purchase', label:  <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Purchase Notifications </> },
    { value: 'leave', label:  <><img src={Notifiaction} alt="Item" style={{ width: '25px', marginRight: '8px' }} /> Leave Notifications </> },
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
    const changeRequest = (selectedNotification) => {
      if (selectedNotification === 'item') {
        navigate('/notification-employee');
      } else if (selectedNotification === 'purchase') {
        navigate('/purchase-notification-employee');
      }else if (selectedNotification === 'leave') {
        navigate('/leave-notification-employee');
      };
    }
    changeRequest(selectedNotification);
  }, [selectedNotification])

  useEffect(() => {
    const changeNotification = (selectedRequest) => {
      if (selectedRequest === 'item') {
        navigate('/request-employee');
      } else if (selectedRequest === 'purchase') {
        navigate('/purchase-request');
      } else if (selectedRequest === 'leave') {
        navigate('/employee-leave-request');
      };
    }
    changeNotification(selectedRequest);
  }, [selectedRequest])

  return (
    <div className="navbar">
      <ul className='ul1'>
        <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
        <li className='li1'><Link to={'/home-employee'}>Home</Link></li>
        <li style={{ float: 'left', marginLeft: '3px',  marginTop: '-5px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
      </ul>
      <ul className='ul2Admin'>
        {/* <li style={{display: 'flex', flexDirection: 'inline', gap: '12px', backgroundColor: 'blue'}}><Link to={'/account-employee'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li> */}
        <li className='liAdmin'><Link to={'/account-employee'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li>
        <Select
          options={option}
          styles={customStyles}
          placeholder="Request"
          onChange={handleRequestChange}
        />
        <Select
          options={options}
          styles={customStyles}
          placeholder="Notifications"
          onChange={handleNotificationChange}
        />
        <li className='liAdmin'><Link to={'/terms-employee'}><img src={PolicySVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Terms and Conditions</p></Link></li>
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

export default Navbar;