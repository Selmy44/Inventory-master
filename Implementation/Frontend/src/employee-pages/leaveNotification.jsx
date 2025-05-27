import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './navbar';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Keys from '../keys';

function LeaveNotificationEmployee() {
  
  const [notifications, setNotifications] = useState([]);
  const url = Keys.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem('userID');
      const response = await axios.get(`${url}/get-leave-notifications-employee/${id}`);
      setNotifications(response.data)
    }
    fetchData();
  }, [notifications])


  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const column = [
    {
      name: 'Leave',
      selector: row => row.leave
    },
    {
      name: 'From',
      selector: row => formatDate(row.startDate)
    },
    {
      name: 'To',
      selector: row => formatDate(row.endDate)
    },
    {
      name: 'Days',
      selector: row => row.daysRequired
    },
    {
      name: 'Status',
      selector: row => row.status
    }
  ]

  return (
    <div>
      <Navbar></Navbar>
      <div className="notification-container">
        <h1>Leave Notifications</h1>
        <div style={{ width: '70%', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '9px', borderRadius: '12px' }}>
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

export default LeaveNotificationEmployee;