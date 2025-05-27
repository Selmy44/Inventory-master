import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import NavbarHome from './NavbarHome';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Keys from '../keys';

function NotificationReviewSupervisor() {
  const url = Keys.REACT_APP_BACKEND;

  const [notifications, setNotifications] = useState([]);

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

  return (
    <div>
      <NavbarHome></NavbarHome>
      <div className="notification-container">
        <div style={{ width: '64%' }}>
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

export default NotificationReviewSupervisor;