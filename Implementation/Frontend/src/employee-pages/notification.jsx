import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Keys from '../keys';

function Notification() {
  
  const [notifications, setNotifications] = useState([]);
  const url = Keys.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('userID');
      const response = await axios.get(`${url}/get-all-requests/${id}`);
      setNotifications(response.data)
    }
    fetchData();
  }, [notifications])

  console.log("Notifications: ", notifications);


  const column = [
    {
      name: 'Item Requested',
      selector: row => row.name
    },
    {
      name: 'Category',
      selector: row => row.category_name
    },
    {
      name: 'Date',
      selector: row => row.date_of_request
    },
    {
      name: 'Supervisor Assigned',
      selector: row => row.username
    },
    {
      name: 'Follow Up',
      selector: row => row.status
    }
  ]
  const smaller = {
    display: 'flex',
    flexDirection: 'inline',
    gap: '12px'
  };

  const buttons = {
    width: '65px',
    color: 'black',
    cursor: 'pointer',
    padding: '12px 0px',
    borderRadius: '1px',
    backgroundColor: 'white'
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="notification-container">
        <h1>Item Requisition Notifications</h1>
        <div style={{ width: '64%' ,  borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '9px'}}>
          <DataTable
            data={notifications}
            columns={column}
            pagination
          >
          </DataTable>
        </div>

      </div>
    </div>
  );
}

export default Notification;