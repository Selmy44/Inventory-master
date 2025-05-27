import React, { useEffect, useState } from 'react';
import NavbarMain from './navbarMain';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Red from '../images/red-circle.svg';
import FadeLoader from "react-spinners/FadeLoader";
import Approve from '../images/approve.svg';
import Deny from '../images/deny.png';
import View from '../images/info.svg';
import Modal from 'react-modal';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { io } from 'socket.io-client';
import { storage } from "../firebase";
import PropagateLoader from "react-spinners/PropagateLoader";
import ScaleLoader from "react-spinners/ScaleLoader";
import Keys from '../keys';

function PurchaseNotificationHR() {
    const [viewQuotation, setViewQuotation] = useState(false);
    const [allRequests, setAllRequests] = useState([]);
    const [imageURL, setImageURL] = useState('');
    const [loading, setLoading] = useState(true);
    const [denyModalOpen, setDenyModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    const socket = io.connect(`${ioPort}`);

    const openLoader = (row) => {
        setIsSendModalOpen(true);
        handleApprove(row);
    };

    const closeRequestModal = () => {
        setIsSendModalOpen(false);
    };

    const openDenyLoader = (row) => {
        setDenyModalOpen(true);
        handleDeny(row);
    }

    const closeDenyRequest = () => {
        setDenyModalOpen(false);
    };

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from the server");
    });


    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoading(prevLoading => !prevLoading);
        }, 20000);
        return () => clearInterval(intervalId);
    }, []);

    const handleViewQuotation = (ID) => {
        setViewQuotation(true);
        fetchImageURL(ID);
        setImageURL(ID);
    }

    const closeModal = () => {
        setViewQuotation(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${url}/get-purchase-notification-hr`);
                const result = response.data;
                setAllRequests(result);
                console.log("DATAS: ", result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const fetchImageURL = async (ID) => {
        try {
            if (ID) {
                console.log("ID PROVIDED: ", ID)
                const imageRef = ref(storage, `images-for-hr/${ID}`);
                const imageURL = await getDownloadURL(imageRef);
                setImageURL(imageURL);
            };
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    console.log("Fetched Image Type: ", imageURL);

    const svgStyle = {
        width: '27px',
        height: '27px',
        borderRadius: '14px',
    };

    const div = {
        width: '90%',
        marginLeft: '15%',
    }

    const smaller = {
        display: 'flex',
        flexDirection: 'inline',
    }

    const buttons = {
        width: '65px',
        color: 'black',
        borderRadius: '9px',
        cursor: 'pointer',
        padding: '12px 0px',
        borderRadius: '1px',
        backgroundColor: 'white'
    };

    const column = [
        {
            name: 'Requestor',
            selector: row => row.username
        },
        {
            name: 'Item Requested',
            selector: row => row.expenditure_line
        },
        {
            name: 'End Goal',
            selector: row => row.end_goal
        },
        {
            name: 'Amount',
            selector: row => row.amount
        },
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Status',
            selector: row => row.status
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
            name: 'View Quotation',
            cell: row => (
                <button className='buttonStyle3' onClick={() => handleViewQuotation(row.id)}><img src={View} style={svgStyle} alt="Deny" /></button>
            )
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
                <button className='buttonStyle3' onClick={() => openDenyLoader(row)}><img src={Deny} style={svgStyle} alt="Approve" /></button>
            )
        },

    ];

    const handleApprove = async (row) => {

        setInterval(() => {
            setIsSendModalOpen(false);
        }, 2600);

        socket.emit("Send Approved Email Purchase", row);
        socket.emit("Take this purchase", row);
        socket.emit("change-status-approve-purchase", row);

        try {
            const id = row.id;
            await axios.put(`${url}/approve-by-hr-purchase/${id}`);
        } catch (error) {
            console.error("Error :", error);
        }
    }

    const handleDeny = async (notification) => {

        setInterval(() => {
            setDenyModalOpen(false);
        }, 2600);

        socket.emit("Deny For Employee Purchase", notification);
        try {
            const id = notification.id;
            await axios.put(`${url}/deny-by-hr-purchase/${id}`);
            console.log("Denied for ID", notification.id);
        } catch (error) {
            console.log('Error', error);
        }
    };

    const handlePending = async () => {
        console.log("HandlePending is Hit");
        const hrID = localStorage.getItem("userID");
        const response = await axios.get(`${url}/get-purchase-notification-hr`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllRequests(result);
    };

    const handleApprovedRequest = async () => {
        console.log("HandleApproved is Hit");
        const hrID = localStorage.getItem('userID');
        const response = await axios.get(`${url}/get-approved-purchase-notification-hr`);
        const result = response.data;
        console.log("DATA FROM ENDPOINT: ", result);
        setAllRequests(result)
    }

    const handleDenyRequest = async () => {
        console.log("HandleDenied is Hit");
        const hrID = localStorage.getItem('userID');
        const response = await axios.get(`${url}/get-denied-notification-purchase-hr`);
        const result = response.data;
        console.log("DATA For Denied: ", result);
        setAllRequests(result);
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

    return (
        <div>
            <NavbarMain></NavbarMain>
            <div className="notification-supervisor">
                <div style={div}>
                    <h1 style={{ color: 'black' }}>Purchase Notifications</h1>
                    <div style={smaller}>
                        <button style={buttons} onClick={handlePending}>Pending</button>
                        <button style={buttons} onClick={handleApprovedRequest}>Approved</button>
                        <button style={buttons} onClick={handleDenyRequest} >Denied</button>
                    </div>
                    <div style={{ width: '95%', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '9px', borderRadius: '12px' }}>
                        <DataTable
                            data={allRequests}
                            columns={column}
                            pagination
                        ></DataTable>
                    </div>
                    <Modal isOpen={viewQuotation} onRequestClose={closeModal} style={modal}>
                        <div style={{ width: "100%", height: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {imageURL ? (
                                <img src={imageURL} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
                            ) : (
                                <div className="NoPage">
                                    <FadeLoader color={'#D0031B'} loading={loading} size={200} />
                                </div>
                            )}
                        </div>
                    </Modal>
                    <Modal isOpen={isSendModalOpen} onRequestClose={closeRequestModal} className={modal}>
                        <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                            <PropagateLoader color={'green'} loading={loading} size={19} />
                            <div>
                                <br />
                                <br />
                                <p>Finalizing Request...</p>
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
    );
}

export default PurchaseNotificationHR;