import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Info from '../images/info.svg'
import axios from "axios";
import NavbarAdmin from './navbarAdmin';
import { ReactPDF, Document, PDFViewer, Page } from '@react-pdf/renderer';
import ImgAdd from '../images/add-photo.svg';
import Modal from 'react-modal';
import { Socket, io } from 'socket.io-client';
import DocViewer, {DocViewerRenderers} from '@cyntler/react-doc-viewer';
import DataTable from 'react-data-table-component';
import AddItem from '../images/addItem.svg'
import PulseLoader from "react-spinners/PulseLoader";
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, listAll, list, } from "firebase/storage";
import Keys from '../keys';
// import { Worker, Viewer } from '@react-pdf-viewer/core';

function TrustedSuppliers() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    // const socket = io.connect(`${ioPort}`);

    const [imageUrl, setImageUrl] = useState('');
    const [dates, setDates] = useState({ date1: '', date2: '' });
    const [countDown, setCountDown] = useState({ months: 0, days: 0 });
    const [loading, setLoading] = useState(true);
    const [trustedSuppliers, setTrustedSuppliers] = useState([]);
    const [imageUpload, setImageUpload] = useState(null);
    const [latestId, setLatestID] = useState('');
    const [file, setFile] = useState('');
    const [isCreatingNewSupplierOpen, setIsCreatingNewSupplierOpen] = useState(false);
    const [oneSupplier, setOneSupplier] = useState(false);
    const [isTrustedSupplierModalOpen, setIsTrustedSupplierModalOpen] = useState(false);
    const [oneTrustedSupplier, setOneTrustedSupplier] = useState([]);
    const [isPDFViewOpen, setIsPDFViewOpen] = useState(false);
    const [newTrustedSupplier, setNewTrustedSupplier] = useState({
        name: '',
        dateEntered: '',
        endEntered: '',
        product: '',
        email: '',
        address: ''
    });

    const openPDFViewer = (ID) => {
        setIsPDFViewOpen(true);
        fetchPDF(ID);
    };

    const closePDFViewer = () => {
        setIsPDFViewOpen(false);
    };

    const openOneSupplier = (ID) => {
        setOneSupplier(true);
        getDates(ID);
        bringOneSupplier(ID);
    };

    const closeOneSupplier = () => {
        setOneSupplier(false);
    };

    const openCreatingModal = () => {
        setIsCreatingNewSupplierOpen(true);
        handleMake();
    };

    const closeCreatingModal = () => {
        setIsCreatingNewSupplierOpen(false);
    };


    const openSimpleModal = () => {
        setIsTrustedSupplierModalOpen(true);
    };

    const closeSimpleModal = () => {
        setIsTrustedSupplierModalOpen(false);
    };

    // socket.on("connect", () => {

    // });

    // socket.on("disconnect", () => {
    //     console.log("Disconnected from the server");
    // })

    const kain = {
        gap: '12px',
        color: 'black',
        display: 'flex',
        paddingTop: '70px',
        marginLeft: '23px',
        marginLeft: '20px',
        alignContent: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
    };

    const employeeContainer = {
        width: '100%',
        height: '120vh',
        display: 'flex',
        flexWrap: 'wrap',
        overFlow: 'auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
    };

    const smallTable = {
        width: '65%',
        height: '76%',
        backgroundColor: 'white',
        display: 'flex',
        borderRadius: '23px',
        flexDirection: 'column',
        marginTop: '12px',
        marginLeft: '16%',
    };

    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    };

    const loaderModal = {
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
    }

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '36%',
            marginLeft: '495px',
            height: '94%',
            backgroundColor: 'rgb(206, 206, 236)',
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
    }

    const modal3 = {
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


    useEffect(() => {

        const getTrustedSuppliers = async () => {
            const response = await axios.get(`${url}/get-trusted-suppliers`);
            setTrustedSuppliers(response.data);
        }
        getTrustedSuppliers();
    }, [trustedSuppliers]);

    const column = [
        {
            name: 'Name',
            selector: row => row.name
        },
        {
            name: 'Date Assigned',
            selector: row => row.date_entered
        },
        {
            name: 'Product',
            selector: row => row.product
        },
        {
            name: 'View',
            cell: row => (
                <button className='addItem-btn' onClick={() => openOneSupplier(row.id)}><img src={Info} style={svgStyle} /></button>
            )
        },
    ];

    const handleMake = async () => {

        if (imageUpload == null) return;
        const IdForQuotation = latestId + 1;
        // console.log("ID FOR PDF: ", IdForQuotation);
        const imageRef = ref(storage, `SuppliersPDF/${imageUpload.name, IdForQuotation}`);
        uploadBytes(imageRef, imageUpload).then(() => {
        });

        try {
            // console.log("Passing Data: ", newTrustedSupplier)
            await axios.post(`${url}/new-trusted-supplier`, newTrustedSupplier);
            setIsTrustedSupplierModalOpen(false);
        } catch (error) {
            console.log('Error', error)
        };

        setInterval(() => {
            setIsCreatingNewSupplierOpen(false);
        }, 2700);
    };

    useEffect(() => {
        const fetchIDs = async () => {
            try {
                const response = await axios.get("/get-trusted-supplier-id");
                const latestID = response.data[0].id
                setLatestID(latestID);
            } catch (error) {
                console.log("Error: ", error);
            };
        }
        fetchIDs();
    }, [])

    const modal2 = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '23%',
            marginLeft: '495px',
            height: '72vh',
            backgroundColor: 'rgb(206, 206, 236)',
            border: 'none',
            borderRadius: '12px',
            color: "black",
            fontFamily: '',
            padding: '2px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    const OneStyle = {
        gap: '14px',
        padding: '8px',
        width: 'auto',
        height: '298px',
        display: 'flex',
        color: 'black',
        alignItems: 'center',
        borderRadius: '15px',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        fontWeight: '2px',
        backgroundColor: 'rgb(206, 206, 236)',
    }

    const bringOneSupplier = async (ID) => {
        try {
            const response = await axios.get(`${url}/get-one-trusted-supplier/${ID}`);
            setOneTrustedSupplier(response.data);
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const updateFileName = (event) => {
        const selectedFile = event.target.files[0];
        setImageUpload(event.target.files[0]);
        const fileName = selectedFile ? selectedFile.name : 'No file Chosen';
        setFile(fileName);
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile)
        };
    };

    const fetchPDF = async (ID) => {
        try {
            if (ID) {
                // console.log("ID PROVIDED: ", ID);
                const PDFRef = ref(storage, `SuppliersPDF/${ID}`);
                const PDFURL = await getDownloadURL(PDFRef);
                console.log('PDF URL: ', PDFURL);
                setImageUrl(PDFURL);
            };
        } catch (error) {
            console.error("Error: ", error);
        };
    };


    const getDates = async (ID) => {
        // console.log("Dates Function Being Hit");
        const response = await axios.get(`${url}/trustedSuppliers-dates/${ID}`);
        setDates(response.data);
    };

    useEffect(() => {
        // console.log("Date Entered: ", dates.date_entered);
        // console.log("Date Of End: ", dates.end_of_contract);

        if (dates.date_entered && dates.end_of_contract) {
            const startDate = new Date(dates.date_entered);
            const endDate = new Date(dates.end_of_contract);

            let months;
            if (endDate.getMonth() >= startDate.getMonth()) {
                months = endDate.getMonth() - startDate.getMonth();
            } else {
                months = 12 - startDate.getMonth() + endDate.getMonth();
            }

            const days = endDate.getDate() - startDate.getDate();

            setCountDown({ months, days });
        };
    }, [dates]);

    const countdownString = `${countDown.months} months and ${countDown.days} days`

  const docs = [
    {
        uri: imageUrl,
        fileType: 'pdf',
    },
  ];




    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div style={kain}>
                <h1>List Of Trusted Suppliers</h1>
                <button className='addItem-btn' onClick={() => openSimpleModal()}><img src={AddItem} style={svgStyle} /></button>
            </div>
            <div style={employeeContainer}>
                <div style={smallTable}>
                    <DataTable
                        data={trustedSuppliers}
                        columns={column}
                        pagination
                    ></DataTable>
                </div>
                <Modal isOpen={isTrustedSupplierModalOpen} onRequestClose={closeSimpleModal} style={modal}>
                    <h1>Adding A New Trusted Supplier</h1>
                    <input type='text' placeholder='Name' name='name' value={newTrustedSupplier.name} onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, name: e.target.value })} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', width: '39%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(163, 187, 197)', borderRadius: '12px' }}>
                        <p>Starting Date Of Contract:</p> <input type='date' placeholder='Enter Date Of Entry' value={newTrustedSupplier.dateEntered} name='dateEntered' onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, dateEntered: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', width: '39%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(163, 187, 197)', borderRadius: '12px' }}>
                        <p>End Of Contract Date</p> <input type='date' placeholder='End Of Contract Date' name='endEntered' value={newTrustedSupplier.endEntered} onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, endEntered: e.target.value })} />
                    </div>
                    <input type='text' placeholder='Product' value={newTrustedSupplier.product} name='product' onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, product: e.target.value })} />
                    <input type='email' placeholder='Email' value={newTrustedSupplier.email} name='email' onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, email: e.target.value })} />
                    <div style={{ display: 'flex', flexDirection: 'inline', height: '40%', width: '85%', borderRadius: '12px', alignItems: 'center', backgroundColor: 'rgb(163, 187, 197)', gap: '9px' }}>
                        <input type='text' placeholder='Address' value={newTrustedSupplier.address} name='address' onChange={(e) => setNewTrustedSupplier({ ...newTrustedSupplier, address: e.target.value })} />
                        <p>Attach Contract (PDF)</p>
                        <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
                            <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                            {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
                        </label>
                    </div>
                    <button className='buttonStyle2' onClick={openCreatingModal}>Submit</button>
                </Modal>
                <Modal isOpen={isCreatingNewSupplierOpen} onRequestClose={closeCreatingModal} style={loaderModal}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
                        <PulseLoader color={'cyan'} loading={loading} size={59} />
                        <div>
                            <br />
                            <p>Creating New Trusted Supplier...</p>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={oneSupplier} onRequestClose={closeOneSupplier} style={modal2}>
                    {oneTrustedSupplier.map(supplier => (
                        <div key={supplier.id} style={OneStyle}>
                            <div className="bigger">
                                <p>{supplier.name && supplier.name.charAt(0).toUpperCase()}</p>
                            </div>
                            <p>Name: {supplier.name}</p>
                            <p>Product: {supplier.product}</p>
                            <p>Starting Date Of Contract: {supplier.date_entered}</p>
                            <p>End Date Of Contract: {supplier.end_of_contract}</p>
                            <p>Time Left: {countdownString}</p>
                            <p>View Contract: <button onClick={() => openPDFViewer(supplier.id)}>View</button></p>
                        </div>
                    ))}
                </Modal>

                <Modal isOpen={isPDFViewOpen} onRequestClose={closePDFViewer} style={modal3}>
                   
                 {imageUrl && <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />}
                 
                </Modal>
            </div>
        </div>
    );
};

export default TrustedSuppliers;