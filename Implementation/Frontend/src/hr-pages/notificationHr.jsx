import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import NavbarMain from './navbarMain.jsx';
import DataTable from 'react-data-table-component';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import PropagateLoader from "react-spinners/PropagateLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import Modal from 'react-modal';
import Keys from '../keys.js';


function NotificationHR() {
    const [notifications, setNotifications] = useState([]);
    const [takeSupervisorID, setTakeSupervisorID] = useState('');
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

    });

    socket.on("disconnect", () => {
        console.log("Disconnected from the server");
    });

    const svgStyle = {
        width: '27px',
        height: '27px',
        borderRadius: '14px',
    };

    const handleApprove = async (notifications) => {

        setInterval(() => {
            setIsSendModalOpen(false);
        }, 2600);

        socket.emit("Take This", notifications);
        socket.emit("change-status-approve", notifications);
        try {
            console.log("Notifications to be passed: ", notifications);

            const postResponse = await axios.post(`${url}/post-by-hr`, notifications);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleDeny = async (index, notification) => {

        setInterval(() => {
            setDenyModalOpen(false);
        }, 2600);

        socket.emit("Denied_By_Either(1)", notification);
        socket.emit("change-status-deny", notification);
        socket.emit("change-status-deny-for-employee", notification);
        try {
            await axios.put(`${url}/deny-by-supervisor/${index}`);
        } catch (error) {
        }
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get(`${url}/get-pending-notifications`);
                const result = response.data;
                const supervisorID = result.supervisorID;
                setTakeSupervisorID(supervisorID);
                setNotifications(result);
            } catch (error) {
                console.error(error)
            }
        };
        fetch();
    }, []);

    const div = {
        width: '86%',
        marginLeft: '14%'
    };

    const smaller = {
        display: 'flex',
        flexDirection: 'inline',
    };

    const buttons = {
        width: '65px',
        color: 'black',
        borderRadius: '9px',
        marginTop: '2px',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '9px',
        backgroundColor: 'white'
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


    const handlePending = async () => {
        console.log("HandlePending is Hit");
        const response = await axios.get(`${url}/get-pending-notifications`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result);
    };

    const handleApprovedRequest = async () => {
        console.log("HandleApproved is Hit");
        const response = await axios.get(`${url}/get-approved-notifications`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result)
    }
    const handleDenyRequest = async () => {
        console.log("HandleDenied is Hit");
        const response = await axios.get(`${url}/get-denied-notifications`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setNotifications(result)
    };

    const column = [
        {
            name: 'Employee',
            selector: row => row.employee_username
        },
        {
            name: 'Approved Supervisor ',
            selector: row => row.supervisor_username
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
            selector: row => row.date_approved
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

    return (

        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-hr ">
                <div style={div}>
                    <h1>Item Requisition Notifications</h1>
                    <div style={smaller}>
                        <button style={buttons} onClick={handlePending}>Pending</button>
                        <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
                        <button style={buttons} onClick={handleDenyRequest} >Denied</button>
                    </div>
                    <div style={{ width: '97%', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '9px', borderRadius: '12px' }}>
                        <DataTable
                            data={notifications}
                            columns={column}
                            pagination
                        ></DataTable>
                    </div>
                </div>
                <Modal isOpen={isSendModalOpen} onRequestClose={closeRequestModal} className={modal}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                        <PropagateLoader color={'green'} loading={loading} size={19} />
                        <div>
                            <br />
                            <br />
                            <p>Sent Request To Stock-Manager</p>
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
export default NotificationHR;
