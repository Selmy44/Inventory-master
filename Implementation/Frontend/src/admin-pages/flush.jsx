import { Link } from 'react-router-dom';
import axios from 'axios'
import React, { useState } from 'react';
import Modal from 'react-modal'
import Keys from '../keys';
import NavbarAdmin from './navbarAdmin';
import Delete from '../images/delete.svg';
// import DataTable from 'datatables.net-dt';
// import DT from 'datatables.net-dt';

import DataTable from 'react-data-table-component';


// DataTable.use(DT);


const Container = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    overflow: 'auto',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Arial', sans-serif",
    backgroundColor: ' rgb(163, 187, 197)',
};

const buttonStyle = {
    width: '15%',
    height: '53px',
    textAlign: 'center',
    borderRadius: '15px',
    // background-color: rgb(48, 48, 205);
};

const display = {
    display: 'flex',
    flexDirection: 'inline',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // gap: '92px',
    overflow: 'hidden',
    maxHeight: '100%',
    whiteSpace: 'nowrap',
};

const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
}

const modalStyles = {
    overlay: {
        zIndex: '20',
    },
    content: {
        top: '50%',
        width: '90%',
        height: '90%',
        left: '50%',
        overflow: 'auto',
        maxHeight: '100%',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        right: 'auto',

        bottom: 'auto',
        borderRadius: '12px',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.9,
        fontFamily: 'Your Custom Font, sans-serif',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        lineHeight: '1.5',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
}

function Flush() {

    const url = Keys.REACT_APP_BACKEND;


    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isItemTransactionModalOpen, setIsItemTransactionModalOpen] = useState(false);
    const [allCompanyRecords, setAllCompanyRecords] = useState([]);
    const [ItemTransactionsRecords, setItemTransactionsRecords] = useState([]);

    const openCompany = () => {
        handleCompanyRecords();
        setIsCompanyModalOpen(true);
    };

    const closeCompanyModal = () => {
        setIsCompanyModalOpen(false);
    };

    const closeItemTransaction = () => {
        setIsItemTransactionModalOpen(false)
    }

    const openItemTransaction = () => {
        handleItemTransaction();
        setIsItemTransactionModalOpen(true);
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCompanyRecords = async () => {

        try {
            const response = await axios.get(`${url}/get-all-company-records`);
            setAllCompanyRecords(response.data);
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const handleItemTransaction = async () => {
        try {
            const response = await axios.get(`${url}/get-item-transactions`);
            setItemTransactionsRecords(response.data);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const handleDeleteCompanyRecord = async (ID) => {
        try {
            await axios.delete(`${url}/delete-company-record/${ID}`);
            window.alert("Done!!!");
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const handleDeleteItemTransactionRecord = async (ID) => {
        try {
            await axios.delete(`${url}/delete-item-transaction/${ID}`);
            window.alert("Done!!!");
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const CompanyColumn = [
        {
            name: 'Company',
            selector: row => row.CompanyName
        },
        {
            name: 'Issue',
            selector: row => row.username
        },
        {
            name: 'Item',
            selector: row => row.name
        },
        {
            name: 'Date',
            selector: row => formatDate(row.date)
        },
        {
            name: 'Amount',
            selector: row => row.amount
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Delete Record',
            selector: row => (
                <button className='addItem-btn' onClick={() => handleDeleteCompanyRecord(row.id)}><img src={Delete} style={svgStyle} /> </button>
            )
        },
    ];

    const itemTransactionColumn = [
        {
            name: 'Date',
            selector: (row) => formatDate(row.date),
        },
        {
            name: 'Item',
            selector: (row) => row.name,
        },
        {
            name: 'In-Stock',
            selector: (row) => row.amount
        },
        {
            name: 'Out-Stock',
            selector: (row) => row.action === 'Out' ? row.amount : 0
        },
        {
            name: 'Requestor',
            selector: (row) => row.username,
        },
        {
            name: 'Company',
            selector: (row) => row.CompanyName,
        },
        {
            name: 'Return',
            selector: (row) => row.retour,
        },
        {
            name: 'Current Balance',
            selector: (row) => row.remaining,
        },
        {
            name: 'Delete Record',
            selector: row => (
                <button className='addItem-btn' onClick={() => handleDeleteItemTransactionRecord(row.id)}><img src={Delete} style={svgStyle} /> </button>
            )
        },
    ];


    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div style={Container}>
                <div className="flush">

                    <button onClick={() => openCompany()} style={buttonStyle}>Company Records</button>
                    <button onClick={() => openItemTransaction()} style={buttonStyle}>Item Transaction Records</button>

                </div>

                <Modal isOpen={isCompanyModalOpen} onRequestClose={closeCompanyModal} style={modalStyles} >

                    <div style={display}>

                        <div style={{ width: '30%', height: '100%', display: 'flex', alignItems: 'center' }}>
                            <h1>Company Records</h1>
                        </div>
                        <div style={{ display: 'flex', height: '100%', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
                            <DataTable
                                data={allCompanyRecords}
                                columns={CompanyColumn}
                                selectableRows
                                // pagination
                            ></DataTable>
                        </div>

                    </div>

                </Modal>

                <Modal isOpen={isItemTransactionModalOpen} onRequestClose={closeItemTransaction} style={modalStyles} >
                    <div style={display}>

                        <div style={{ width: '25%', marginTop: '400px', height: '100%', alignItems: 'center' }}>
                            <h1>Item Transaction  </h1>
                            <h1>Records</h1>

                        </div>
                        <div style={{ display: 'flex', height: '90%', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
                            <DataTable
                                data={ItemTransactionsRecords}
                                columns={itemTransactionColumn}
                                pagination
                            ></DataTable>
                        </div>
                    </div>
                </Modal>

            </div>
        </div>
    );
}

export default Flush;
