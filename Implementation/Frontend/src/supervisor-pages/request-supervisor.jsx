import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Multiselect } from 'multiselect-react-dropdown';
import Red from '../images/red-circle.svg';
import Green from '../images/green-circle.svg';
import Cyan from '../images/cyan-circle.svg';
import Select from 'react-select';
import Modal from 'react-modal'
import PulseLoader from "react-spinners/PulseLoader";
import NavbarHome from './NavbarHome';
import Keys from '../keys';


function RequestSupervisor() {

  const [amount, setAmount] = useState({
    amount: '',
  });
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState([]);
  const [backCount, setBackCount] = useState('');
  const [item, setItem] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ItemNameTrial, setItemNameTrial] = useState('');
  const [someName, setSomeName] = useState({});
  const [options, setOptions] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [supervisorId, setSupervisorId] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageDataForDown, setMessageDataForDown] = useState([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const openLoader = () => {
    setIsSendModalOpen(true);
    sendMessage();
  }

  const closeRequestModal = () => {
    setIsSendModalOpen(false);
  }


  const openModal = () => {
    setIsMessageModalOpen(true);
  };

  const closeModal = () => {
    setIsMessageModalOpen(false);
  }

  const Selects = {
    width: '43%',
    height: '18%',
    color: 'black',
    border: 'none',
    borderRadius: '21px'
  };

  const Option = {
    width: '39%',
    height: '25%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  };

  const ioPort = Keys.REACT_APP_SOCKET_PORT;
  const url = Keys.REACT_APP_BACKEND;

  const socket = io.connect(ioPort);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${url}/category`);
        setCategory(res.data);
      } catch (error) {
        console.error("Error: ", error)
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchItem = async (categoryID) => {
      console.log("CategoryID: ", categoryID);
      try {
        const response = await axios.get(`${url}/items/${categoryID}`);
        setItem(response.data);
        setOptions(response.data);

      } catch (error) {
        console.error("Error: ", error);
      }
    }
    if (selectedCategory) {
      fetchItem(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
  }

  useEffect(() => {
    const fetchCount = async (itemID) => {
      try {
        const itemId = itemID;
        const response = await axios.get(`${url}/get-total-number/${itemId}`);
        setBackCount(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
    if (someName.id) {
      fetchCount(someName.id);
    }
  }, [someName]);

  const handleAmount = (event) => {
    setAmount((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const [taker, setTaker] = useState('');
  const get = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  const date = Date.now();


  const message = {
    id: taker,
    employee: get,
    item: someName.name,
    count: amount.amount,
    description: description,
    email: email,
    date: formatDate(date),
  }

  const sendMessage = async () => {

    const get = localStorage.getItem('username');
    const email = localStorage.getItem('email')
    const date = Date.now();
    const response = await axios.get(`${url}/get-number`);
    const idTaker = response.data.latestId + 1;
    setTaker(idTaker);

    const messageData = {
      id: idTaker,
      employeeName: get,
      categoryName: category[0].category_name,
      itemName: someName.name,
      count: amount.amount,
      description,
      email: email,
      date: formatDate(date),

    };

    messageData.priority = selectedPriority;
    messageData.supervisor = selectedSupervisor;

    setMessageDataForDown([messageData]);

    console.log("SelectedPriority", selectedPriority);
    console.log("MessageData Data: ", messageData);

    setInterval(() => {
      setIsSendModalOpen(false);
    }, 2000);

    socket.emit("Employee_Message_Supervisor(1)", messageData);
    try {
      const response = await axios.post(`${url}/add-request-employee-supervisor`, messageData);
      messageData.id = id;
      const id = response.id;
      console.log("Response", response);
    } catch (error) {
      console.error("Error Occurred Unexpectedly", error)
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })
  };


  const handleSelectedItemName = (selectedList) => {
    setItemNameTrial(selectedList.map(item => setSomeName(item)))
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

  const sumStyle = {
    display: 'flex',
    flexDirection: 'inline',
    gap: '12px',
    width: '90%',
    height: '33%'
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
      // justifyContent: 'center',
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

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.value);
  };

  const supervisor = supervisorId.map((supervisor) => ({
    value: supervisor.id,
    label: supervisor.username
  }));

  const handleSupervisorChange = (event) => {
    setSelectedSupervisor(event.value);
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

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
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

  console.log("MessageData FOR DOWN: ", messageDataForDown);

  const No = {
    width: '10%',
    height: '10vh',
    display: 'flex',
    textAlign: 'center',
    fontWeight: '100px',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'Black',
    color: 'rgb(12, 193, 199)',
    fontFamily: 'Arial, sans-serif',
  }

  return (
    <div>
      <NavbarHome></NavbarHome>
      <div style={kain}>
        <h1>Requisition Tab</h1>
      </div>
      <div className='request-container'>
        <div className='request'>
          <select onChange={handleCategoryChange} value={selectedCategory} style={Selects}>
            <option value='' disabled>Select Category</option>
            {category.map(categories => (
              <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
            ))}
          </select>

          <Multiselect options={options} displayValue='name' onSelect={handleSelectedItemName} />

          <div style={sumStyle}>
            <input placeholder='Amount Desired ...' type='text' id='hein' name='amount' onChange={handleAmount} />

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
          <textarea required name='description' value={description} onChange={(e) => setDescription(e.target.value)} >Description</textarea>
          {/* <button onClick={sendMessage}>Send</button> */}
          <button className='buttonStyle2' onClick={openModal}>Review</button>

          <Modal isOpen={isMessageModalOpen} onRequestClose={closeModal} style={modal}>
            <div className='request-review'>
              <h1>Request Review</h1>
              <br />
              <p>Item Requested: {message.item}</p>
              <br />
              <p>Amount: {message.count}</p>
              <br />
              <p>Description: {message.description}</p>
              <br />
              <p>Your Email: {message.email}</p>
              <br />
              <p>Date of Request: {message.date}</p>
              <br />
              <div style={{width: '50%', display: 'flex', gap: '12px'}}>
                <button className='buttonStyle2' onClick={openLoader}>Send</button>
                <button className='buttonStyle2' onClick={closeModal}>Cancel</button>
              </div>
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

export default RequestSupervisor;
