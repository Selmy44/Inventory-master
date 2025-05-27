import { Link } from 'react-router-dom';
import NavbarMain from './navbarMain';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import io from 'socket.io-client';
import Keys from '../keys';
import Approve from '../images/approve.svg';
import FadeLoader from "react-spinners/FadeLoader";
import Deny from '../images/deny.png';
import PropagateLoader from "react-spinners/PropagateLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import Modal from 'react-modal';

function LeaveNotificationsHR() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;
    const socket = io.connect(`${ioPort}`);

    const div = {
        width: '100%',
        height: 'auto',
    };

    const svgStyle = {
        width: '27px',
        height: '27px',
        borderRadius: '14px',
    };

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '80%',
            maxWidth: '800px',
            height: 'auto',
            border: 'none',
            marginLeft: '295px',
            overflow: 'auto',
            borderRadius: '12px',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    const buttons = {
        width: '65px',
        borderRadius: '9px',
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

    const [allLeaveRequests, setAllLeaveRequests] = useState([]);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [denyModalOpen, setDenyModalOpen] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const func = async () => {
            try {

                const response = await axios.get(`${url}/getor-leave-hr`);
                setAllLeaveRequests(response.data);

            } catch (error) {
                console.error("Error: ", error);
            }
        }
        func();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const openLoader = (row) => {
        setIsSendModalOpen(true);
        handleApprove(row);
    };

    const closeRequestModal = () => {
        setIsSendModalOpen(false);
    };

    const openDenyLoader = (rowID) => {
        setDenyModalOpen(true);
        handleDeny(rowID);
    }

    const closeDenyRequest = () => {
        setDenyModalOpen(false);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoading(prevLoading => !prevLoading);
        }, 20000);
        return () => clearInterval(intervalId);
    }, []);

    const handleApprove = async (row) => {

        setInterval(() => {
            setIsSendModalOpen(false);
        }, 2600);

        await axios.put(`${url}/change-employee-leave-status-hr/${row.id}`).then(
            await axios.put(`${url}/approve-employee-leave-hr-table/${row.id}`).then(
                socket.emit('Approve Leave Requested', row)
            )
        );
    };

    const handleDeny = async (rowID) => {

        setInterval(() => {
            setDenyModalOpen(false);
        }, 2600);

        const response = await axios.put(`${url}/deny-employee-leave-hr/${rowID}`).then(await axios.put(`${url}/deny-employee-leave-hr-table/${rowID}`));

    }


    const column = [
        {
            name: 'Requestor',
            selector: row => row.employeeName
        },
        {
            name: 'Role',
            selector: row => row.role_name
        },
        {
            name: 'Approved Supervisor',
            selector: row => row.supervisorConcerned
        },
        {
            name: 'Description',
            selector: row => row.description
        },
        {
            name: 'Date Of Request',
            selector: row => row.date_of_request
        },
        {
            name: 'Start Date',
            selector: row => formatDate(row.startDate)
        },
        {
            name: 'End Date',
            selector: row => formatDate(row.endDate)
        },
        {
            name: 'Days Required',
            selector: row => row.days_required
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Approve',
            cell: row => (
                <button className='buttonStyle3' onClick={() => openLoader(row)}><img src={Approve} style={svgStyle} alt="Approve" /></button>
            )
        },
        {
            name: 'Deny',
            cell: row => (
                <button className='buttonStyle3' onClick={() => openDenyLoader(row.id)}><img src={Deny} style={svgStyle} alt="Deny" /></button>
            )
        }

    ]

    const handlePending = async () => {
        try {
            console.log("HandlePending is Hit");
            const response = await axios.get(`${url}/getor-leave-hr`);
            setAllLeaveRequests(response.data);
        } catch (error) { console.error("Error: ", error) }
    };

    const handleApprovedRequest = async () => {
        console.log("HandleApproved is Hit");
        const response = await axios.get(`${url}/get-approved-notification-leave-hr`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllLeaveRequests(result);
    };

    const handleDenyRequest = async () => {
        console.log("HandleDenied is Hit");
        const response = await axios.get(`${url}/get-denied-notification-leave-hr`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllLeaveRequests(result)
    };

    return (
        <div>
            <NavbarMain></NavbarMain>
            <div className="leave-notification-container">
                <div className="leave-hr">
                    <h1>Employee Leave Notifications</h1>
                    <br />
                    <br />
                    <div style={div}>
                        <div style={smaller}>
                            <button style={buttons} onClick={handlePending}>Pending</button>
                            <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
                            <button style={buttons} onClick={handleDenyRequest} >Denied</button>
                        </div>
                        <div style={{ width: '100%', marginTop: '9px', height: 'auto', borderRadius: '12px' }}>
                            <DataTable
                                columns={column}
                                data={allLeaveRequests}
                                pagination
                            ></DataTable>
                        </div>
                        <Modal isOpen={isSendModalOpen} onRequestClose={closeRequestModal} className={modal}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                                <PropagateLoader color={'green'} loading={loading} size={19} />
                                <div>
                                    <br />
                                    <br />
                                    <p>Request Sent to HR for Second-tier Approval</p>
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
            </div>
        </div>
    );
}

export default LeaveNotificationsHR;
