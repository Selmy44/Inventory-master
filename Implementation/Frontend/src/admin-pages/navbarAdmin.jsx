import { Link, useNavigate } from 'react-router-dom';
import Centrika from '../images/centrika-removebg.png';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import AccountIcon from '../images/accountSVG.svg';
import Employees from '../images/employeesSVG.svg'
import Modal from 'react-modal';
import ItemSVG from '../images/ItemSVG.svg';
import CategorySVG from '../images/CategorySVG.svg';
import NotificationSVG from '../images/notificationSVG.svg';
import DepartmentRolesSVG from '../images/DepartmentsRolesSVG.svg';
import PolicySVG from '../images/policySVG.svg';
import Keys from '../keys';
import Company from '../images/company.svg'

function NavbarAdmin() {

  const url = Keys.REACT_APP_BACKEND;

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const modalStyles = {
    content: {
      top: '18%',
      width: '20%',
      left: '20%',
      right: 'auto',
      gap: '12px',
      borderRadius: '12px',
      height: '25%',
      marginRight: '-20%',
      transform: 'translate(-50%, -50%)',
      zIndex: '20',
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
      zIndex: '20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  const handleTransactionChange = (event) => {
    setTransactionType(event.value);
  };

  useEffect(() => {
    const changeTransaction = (transactionType) => {
      if (transactionType === 'item') {
        navigate('/item-transaction')
      } else if (transactionType === 'action') {
        navigate('/action-transaction')
      } else if (transactionType === 'report') {
        navigate('/item-transactions')
      } else if (transactionType === 'flush') {
        navigate('/flush')
      };
    }
    changeTransaction(transactionType);
  }, [transactionType]);

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

  const options = [
    { value: 'trusted', label: "Trusted Suppliers", icon: <Employees /> },
    { value: 'local', label: "Local Suppliers" },
  ];

  const option = [
    { value: 'flush', label: "Flush" },
    { value: 'item', label: "Item Transaction" },
    { value: 'action', label: "Action Transaction" },
    { value: 'report', label: "Item Transaction Report" },
  ]

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
      width: '54px',
      height: '24px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
    })
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.value);
  };

  useEffect(() => {
    const changeSupplier = (selectedSupplier) => {
      if (selectedSupplier === 'trusted') {
        navigate('/trusted-suppliers');
      } else if (selectedSupplier === 'local') {
        navigate('/local-supplier-admin');
      };
    };
    changeSupplier(selectedSupplier);
  }, [selectedSupplier]);

  const [count, setCount] = useState([]);

  useEffect(() => {
    const bringPendingNumbers = async () => {
      const response = await axios.get(`${url}/pending-numbers`);
      setCount(response.data);
    }
    bringPendingNumbers();
  }, [setCount]);

  return (
    <div >

      <ul className='ul1Admin'>
        <li className='li1Admin' onClick={handleLogout}><Link to={'/'}>Log Out</Link></li>
        <li className='li1Admin'><Link to={'/home-admin'}>Home</Link></li>
        <li style={{ float: 'left', marginLeft: '3px', marginTop: '-5px' }} className='li1Admin'><img style={{ maxWidth: '100%', marginTop: '1px', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>

        {/* <li style={{ float: 'left', marginLeft: '193px' }} ><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li> */}
      </ul>

      <ul className='ul2Admin'>
        <li className='liAdmin'><Link to={'/account-admin'} onMouseOver={openModal}><img src={AccountIcon} style={{ maxWidth: '14%', maxHeight: '50vh' }} /> <p style={{ marginTop: '7px' }}>Account</p></Link></li>
        <li className='liAdmin'><Link to={'/employees-admin'} ><img src={Employees} style={{ maxWidth: '20%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Employees</p></Link></li>
        <li className='liAdmin'><Link to={'/items-admin'}><img src={ItemSVG} style={{ maxWidth: '16%', maxHeight: '50vh' }} /><p style={{ marginTop: '6px' }}>Items</p></Link></li>
        <li className='liAdmin'><Link to={'/category-admin'}><img src={CategorySVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Category</p></Link></li>
        <li className='liAdmin'><Link to={'/company'}><img src={Company} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Company</p></Link></li>
        <div>
          <span style={{ backgroundColor: 'red', marginLeft: '6px', position: 'absolute', zIndex: '2', borderRadius: '45px', padding: '4px 4px 4px 4px' }}>{count.pending_count}</span>
          <li className='liAdmin' style={{ position: 'absolute', zIndex: '1' }}><Link to={'/notification-admin'}><img src={NotificationSVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Notification</p></Link></li>
        </div>
        <br />
        <br />
        <Select
          options={option}
          styles={customStyles}
          placeholder="Transactions"
          onChange={handleTransactionChange}
        />

        <Select
          options={options}
          styles={customStyles}
          placeholder="Suppliers"
          onChange={handleSupplierChange}
        />

        <li className='liAdmin'><Link to={'/departments-and-roles-admin'}><img src={DepartmentRolesSVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }} /><p>Department & Roles</p></Link></li>
        <li className='liAdmin'><Link to={'/terms-admin'}><img src={PolicySVG} style={{ maxWidth: '18%', maxHeight: '50vh' }} /><p style={{ marginTop: '7px' }}>Terms and Conditions</p></Link></li>
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
export default NavbarAdmin;
