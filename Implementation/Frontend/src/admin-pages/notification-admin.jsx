import React, { useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import io from 'socket.io-client';
import axios from 'axios';
import Caution from '../images/caution.svg'
import Modal from 'react-modal';
import RiseLoader from "react-spinners/RiseLoader";
import DataTable from 'react-data-table-component';
import Keys from '../keys';

function NotificationAdmin() {

  const ioPort = Keys.REACT_APP_SOCKET_PORT;
  const url = Keys.REACT_APP_BACKEND;

  const socket = io.connect(`${ioPort}`);

  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [Insuffiencient, setInsuffiencient] = useState(false);
  const [isGivingOutModalOpen, setIsGivingOutModalOpen] = useState(false);

  const openGvingOutModal = (row) => {
    setIsGivingOutModalOpen(true);
    handleSerialStatus(row);
  };

  const closeGivingOutModal = () => {
    setIsGivingOutModalOpen(false);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${url}/get-hr-admin-pending-requests`);
        setNotifications(response.data)
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    fetch();

  }, [])

  const column = [
    {
      name: 'Item',
      selector: row => row.name
    },
    {
      name: 'Requestor',
      selector: row => row.employee_username
    },
    {
      name: 'Supervisor',
      selector: row => row.supervisor_username
    },
    {
      name: 'Category',
      selector: row => row.category_name
    }, {
      name: 'Quantity Requested',
      selector: row => row.amount
    }, {
      name: 'Description',
      selector: row => row.description
    },
    {
      name: 'Date Approved',
      selector: row => row.date_approved
    },
    {
      name: 'Issue Out',
      cell: row => (
        <button style={{ width: '59%', backgroundColor: 'green', color: 'white' }} onClick={() => openGvingOutModal(row)} >Issue to</button>
      ),
    },
  ];

  const handleSerialStatus = async (row) => {
    const requestor = row.employeeID;
    const amount = row.amount;
    const item = row.itemID;
    const rowID = row.id;
    setName(requestor);
    setAmount(amount);
    setItem(item);

    try {

      const response = await axios.put(`${url}/change-status-from-notifications-for-bulk/${requestor}/${item}/${amount}/${rowID}`);
      const result = response.data;

      if (result === "Given Out") {

        socket.emit("Send Approved Email", row);

        const responsee = await axios.put(`${url}/change-request-stockStatus/${rowID}`);
        console.log("Responsee: ", responsee.data);

      } else {

        setInsuffiencient(true);

      }
      setInterval(() => {
        setIsGivingOutModalOpen(false);
      }, 10);

      setInterval(() => {
        setInsuffiencient(false);
      }, 2700);

    } catch (error) {
      console.error("Error: ", error);
    };
  };

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
  }

  const smaller = {
    display: 'flex',
    flexDirection: 'inline',
    gap: '2px'
  };

  const modalAlert = {
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

  const buttons = {
    width: '65px',
    color: 'black',
    cursor: 'pointer',
    padding: '12px 0px',
    borderRadius: '9px',
    backgroundColor: 'white'
  };

  const handlePending = async () => {
    console.log("HandlePending is Hit");
    const response = await axios.get(`${url}/get-hr-admin-pending-requests`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result);
  };

  const handleApprovedRequest = async () => {
    console.log("HandleApproved is Hit");
    const response = await axios.get(`${url}/get-hr-admin-given-requests`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result);
  };

  return (
    <div> <NavbarAdmin></NavbarAdmin>
      <div className="random-container">
        <div style={{ width: '84%', marginLeft: '193px' }}>
          <h1 style={{ color: 'white' }}>Notifications</h1>

          <div style={smaller}>
            <button style={buttons} onClick={handlePending}>Pending</button>
            <button style={buttons} onClick={handleApprovedRequest}>Issued</button>
          </div>

          <div style={{ width: '100%', marginTop: '5px', display: 'flex', gap: '5px', flexDirection: 'column', height: 'auto', borderRadius: '12px' }}>
            <DataTable
              data={notifications}
              columns={column}
              pagination
            ></DataTable>
          </div>

          <Modal isOpen={isGivingOutModalOpen} onRequestClose={closeGivingOutModal} style={modal} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <RiseLoader color={'#3444e5'} loading={loading} size={11} />
              <div style={{ fontFamily: 'sans-serif' }}>
                <br />
                <p>Issuing {amount} {item} to {name}</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={Insuffiencient} style={modalAlert} >
            <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
              <div style={{ display: 'flex', zIndex: '20', border: 'none', gap: '12px', flexDirection: 'inline', borderRadius: '20px', fontFamily: 'Arial, sans-serif', height: '99%', width: '90%', backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                <img src={Caution} style={svgStyle} />
                <p style={{ color: 'white' }}>Insuffiencient Amount To Give Out.</p>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
}
export default NotificationAdmin;
