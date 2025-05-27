import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import NavbarMain from './navbarMain';
import axios from 'axios';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import PulseLoader from "react-spinners/PulseLoader";
import ImgAdd from '../images/add-photo.svg';
import Select from 'react-select';
import Modal from 'react-modal'
import { storage } from '../firebase';
import { ref, uploadBytes } from "firebase/storage";
import Keys from '../keys';


function PurchaseRequestHR() {

  const url = Keys.REACT_APP_BACKEND;


  const [description, setDescription] = useState('');
  const [endGoalValue, setEndGoalValue] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState([]);
  const [file, setFile] = useState('');
  const [cost, setCost] = useState('');
  const [selectedSupervisorName, setSelectedSupervisorName] = useState('');
  const [taker, setTaker] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [latestId, setLatestID] = useState('');
  const [supervisorId, setSupervisorId] = useState([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);


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

  const openLoader = () => {
    setIsSendModalOpen(true);
    sendMessages(messageForDown);
  };

  const closeRequestModal = () => {
    setIsSendModalOpen(false);
  };

  const handleAmount = (event) => {
    setAmount(event.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const kain = {
    marginLeft: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(163, 187, 197)',
    paddingTop: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black'
  };

  const option = [
    { value: 'red', label: <div style={{ display: 'flex', flexDirection: 'inline', gap: '12px' }}><img src={Red} alt="Red" style={{ width: '24px', height: '24px' }} /> <p>Urgent</p></div> },
    { value: 'green', label: <div style={{ display: 'flex', flexDirection: 'inline', gap: '12px' }}><img src={Green} alt="Green" style={{ width: '24px', height: '24px' }} /> <p>Medium</p></div> },
    { value: 'cyan', label: <div style={{ display: 'flex', flexDirection: 'inline', gap: '12px' }}><img src={Cyan} alt="Cyan" style={{ width: '24px', height: '24px' }} /> <p>Low</p></div> }
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 170,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'lightgrey'
      }

    }),
    singleValue: (provided) => ({
      ...provided,
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black'
    })
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.value);
  };

  useEffect(() => {
    const showSupervisor = async () => {
      try {
        const response = await axios.get(`${url}/show-supervisor`);
        console.log("Data: ", response.data);
        setSupervisorId(response.data);
      } catch (error) {
        console.error("Error: ", error);
      };
    }
    showSupervisor();
  }, []);

  const supervisor = supervisorId.map((supervisor) => ({
    value: supervisor.id,
    label: supervisor.username
  }));

  const customStyle = {
    control: (provided) => ({
      ...provided,
      width: 190,
      color: 'white',
      border: 'none',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      '&:hover': {
        backgroundColor: 'lightgrey'
      }

    }),
    singleValue: (provided) => ({
      ...provided,
      width: '54px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'black',
      color: 'white',
    })
  };
  const handleSupervisorChange = (event) => {
    setSelectedSupervisor(event.value);
    setSelectedSupervisorName(event.label)
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
    }
  };

  const employeeID = localStorage.getItem('userID');
  const employeeName = localStorage.getItem('username');
  const employeeEmail = localStorage.getItem('email');

  const messageForDown = {
    id: taker,
    employeeName: employeeName,
    employeeID: employeeID,
    description: description,
    amount: amount,
    email: employeeEmail,
    cost: cost,
    supervisorID: selectedSupervisor,
    supervisorName: selectedSupervisorName,
    endGoalValue: endGoalValue,
    file: file,
    date: Date.now(),
    priority: selectedPriority
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  }

  const handleCost = (event) => {
    setCost(event.target.value);
  };

  console.log("MessageData For Down: ", message);

  const sendMessages = async (message) => {

    const response = await axios.get(`${url}/get-number-purchase`);
    const idTaker = response.data.latestId + 1;
    setTaker(idTaker);

    setInterval(() => {
      setIsSendModalOpen(false);
    }, 2000);

    if (imageUpload == null) return;
    const IdForQuotation = latestId + 1;
    console.log("ID FOR QUOTATION: ", IdForQuotation);
    const imageRef = ref(storage, `images/${imageUpload.name, IdForQuotation}`);
    uploadBytes(imageRef, imageUpload).then(() => {
    });

    try {
      const response = await axios.post(`${url}/add-employee-supervisor-purchase`, message);
      message.id = id;
      const id = response.id;
      console.log("Response", response);
    } catch (error) {
      console.error("Error: ", error);
    };
  };

  useEffect(() => {
    const fetchIDs = async () => {
      try {
        const response = await axios.get(`${url}/get-purchase-id`);
        const latestID = response.data[0].id
        setLatestID(latestID);
      } catch (error) {
        console.log("Error: ", error);
      };
    }
    fetchIDs();
  }, [])

  return (
    <div>
      <NavbarMain></NavbarMain>
      <div style={kain}>
        <h1>Expenditure Request Tab</h1>
      </div>
      <div className='request-container'>
        <div className='request'>
          <textarea style={{ height: '20%', border: 'none' }} required name='description' placeholder='Expenditure Line...' value={description} onChange={(e) => setDescription(e.target.value)} >Expenditure Line...</textarea>
          <div style={{ width: '95%', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <input type='text' id='amount_purchase' placeholder='Amount' name='amount' value={amount} onChange={handleAmount} />
            <div>
              <p>Once-Off cost: <input type='radio' name='cost' value='once-off' onChange={handleCost} /> </p>
              <p>Ongoing cost: <input type='radio' name='cost' value='ongoing' onChange={handleCost} /> </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'inline', gap: '9px' }}>

            <Select
              options={option}
              styles={customStyles}
              placeholder="Select Priority"
              onChange={handlePriorityChange}
            />

            <Select
              options={supervisor}
              styles={customStyle}
              placeholder="Select Supervisor"
              onChange={handleSupervisorChange}
            />
          </div>
          <textarea style={{ height: '20%', border: 'none' }} required name='end_goal' placeholder='End Goal...' value={endGoalValue} onChange={(e) => setEndGoalValue(e.target.value)} ></textarea>
          <div style={{ display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
            <p>Attach Parforma (Not required)</p>
            <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
              <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
              {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
            </label>
          </div>

          <button className='buttonStyle2' onClick={openReviewModal}>Review</button>
          <Modal isOpen={isReviewModalOpen} onRequestClose={closeReviewModal} style={modal} >
            <div className='request-review'>
              <h1>Request Review</h1>
              <br />
              <p>Employee Name: {messageForDown.employeeName}</p>
              <br />
              <p>Description: {messageForDown.description}</p>
              <br />
              <p>Amount: {messageForDown.amount} FRW</p>
              <br />
              <p>End Goal: {messageForDown.endGoalValue}</p>
              <br />
              <p>Priority: {messageForDown.priority}</p>
              <br />
              <p>Email: {messageForDown.email}</p>
              <br />
              <p>Supervisor: {messageForDown.supervisorName}</p>
              <br />
              <p>Date {messageForDown.date}</p>
              <br />
              <p>Quotation: {messageForDown.file}</p>
              <br />
              <label htmlFor='file'>
                <img style={{ width: '92%', marginLeft: '12px' }} src={imageUrl || ImgAdd} alt='Add' />
              </label>
              <button className='buttonStyle2' onClick={openLoader}>Send</button>
            </div>
          </Modal>

          <Modal isOpen={isSendModalOpen} onRequestClose={closeRequestModal} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
              <PulseLoader color={'green'} loading={loading} size={19} />
              <div>
                <p>Processing Request...</p>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestHR;
