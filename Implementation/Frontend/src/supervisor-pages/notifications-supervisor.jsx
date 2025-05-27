import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarHome from './NavbarHome';
import DataTable from 'react-data-table-component';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import PropagateLoader from "react-spinners/PropagateLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import Modal from 'react-modal';
import Keys from '../keys';

function NotificationSupervisor() {
  const [notifications, setNotifications] = useState([]);
  const [denyModalOpen, setDenyModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const ioPort = Keys.REACT_APP_SOCKET_PORT;
  const url = Keys.REACT_APP_BACKEND;

  const socket = io.connect(`${ioPort}`);

  const openLoader = (row, rowId) => {
    setIsSendModalOpen(true);
    handleApprove(row, rowId);
  };

  const closeRequestModal = () => {
    setIsSendModalOpen(false);
  };

  const openDenyLoader = (rowID, row) => {
    setDenyModalOpen(true);
    handleDeny(rowID, row);
  }

  const closeDenyRequest = () => {
    setDenyModalOpen(false);
  };

  socket.on("connect", () => {
    console.log("Connected to the server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the server");
  });



  const svgStyle = {
    width: '27px',
    height: '27px',
    borderRadius: '14px',
  };

  const handleApprove = async (notifications, index) => {

    setInterval(() => {
      setIsSendModalOpen(false);
    }, 2600);

    try {
     
      const supervisorID = localStorage.getItem("userID");

      const supervisorName = localStorage.getItem("username");

      socket.emit("Supervisor_Message_HR(1)", notifications, supervisorName);

      await axios.post(`${url}/add-request-supervisor-hr/${supervisorID}`, notifications);

    } catch (error) {
      console.error('Error', error);
    }
  }

  const handleDeny = async (index, notification) => {
    
    console.log("Notifications id :", index);

    setInterval(() => {
      setDenyModalOpen(false);
    }, 2600);

    socket.emit("Denied_By_Either(1)", notification);
    try {
      await axios.put(`${url}/deny-by-supervisor/${index}`);
      console.log("Denied for ID", index);
      window.alert("Request Denied")
    } catch (error) {
      console.log('Error', error);
    }
  }

  useEffect(() => {
    const bring = async () => {
      try{
        const supervisorID = localStorage.getItem("userID");
        const response = await axios.get(`${url}/getor/${supervisorID}`);
        setNotifications(response.data);

      }catch(error){
        console.error("Error: ", error);
      }
    }
    bring();
  },[])

  console.log("type in Upper logger", typeof notifications);

  const column = [
    {
      name: 'Employee',
      selector: row => row.username
    },
    {
      name: 'Item Requested',
      selector: row => row.name
    },
    {
      name: 'Category ',
      selector: row => row.category_name
    },
    {
      name: 'Request Description',
      selector: row => row.description
    },
    {
      name: 'Date of Request',
      selector: row => row.date_of_request
    },
    {
      name: 'Amount Requested',
      selector: row => row.amount
    },
    {
      name: 'Priority',
      selector: row => (
        row.priority === 'green' ?
          <img src={Green} style={svgStyle} alt="green" /> :
          row.priority === 'red' ?
            <img src={Red} style={svgStyle} alt="red" /> :
            row.priority === 'cyan' ?
              <img src={Cyan} style={svgStyle} alt="cyan" /> :
              (console.log("Not green, red, or cyan"), null)
      )
    },
    {
      name: 'Status',
      selector: row => row.status
    },
    {
      name: 'Approve',
      cell: row => (
        <button className='buttonStyle3' onClick={() => openLoader(row, row.id)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
      )
    },
    {
      name: 'Deny',
      cell: row => (
        <button className='buttonStyle3' onClick={() => openDenyLoader(row.id, row)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
      )
    }
  ];

  const div = {
    width: '90%',
    marginLeft: '13%'
  };

  const buttons = {
    width: '65px',
    color: 'black',
    cursor: 'pointer',
    padding: '12px 0px',
    borderRadius: '1px',
    backgroundColor: 'white'
  };
  
  const smaller = {
    display: 'flex',
    flexDirection: 'inline',
  };

  const handlePending = async () => {
    try{
      console.log("HandlePending is Hit");
      const supervisorID = localStorage.getItem("userID");
      const response = await axios.get(`${url}/getor/${supervisorID}`);
      setNotifications(response.data);
    }catch(error){console.error("Error: ", error)}
  };

  const handleApprovedRequest = async () => {
    console.log("HandleApproved is Hit");
    const response = await axios.get(`${url}/get-approved-notification`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result);
  };

  const handleDenyRequest = async () => {
    console.log("HandleDenied is Hit");
    const response = await axios.get(`${url}/get-denied-notification`);
    const result = response.data;
    console.log("DATA FROM ENDPOINT: ", result);
    setNotifications(result)
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
      height: '76vh',
      backgroundColor: 'rgb(94, 120, 138)',
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

  return (

    <div>
      <NavbarHome></NavbarHome>
      <div className="notification-supervisor">
        <div style={div}>
          <h1>Item Requisition Notifications</h1>
          <div style={smaller}>
            <button style={buttons} onClick={handlePending}>Pending</button>
            <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
            <button style={buttons} onClick={handleDenyRequest} >Denied</button>
          </div>
          <DataTable
            data={notifications}
            columns={column}
            pagination
          ></DataTable>
        </div>

        <Modal isOpen={isSendModalOpen} onRequestClose={closeRequestModal} className={modal}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
            <PropagateLoader color={'green'} loading={loading} size={19} />
            <div>
              <br />
              <br />
              <p>Sent Request To HR...</p>
            </div>
          </div>
        </Modal>

        <Modal isOpen={denyModalOpen} onRequestClose={closeDenyRequest} className={modal}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
            <ScaleLoader color={'red'} loading={loading} size={19} />
            <div>
              <br />
              <br />
              <p>Denying Request...</p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default NotificationSupervisor;