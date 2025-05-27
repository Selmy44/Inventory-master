import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Model from 'react-modal'
import Keys from '../keys';

function AccountAdmin() {

const url = Keys.REACT_APP_BACKEND;

  const modal = {
    overlay: {
      backgroundColor: 'rgba(34, 41, 44, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '29%',
      marginLeft: '495px',
      height: '64vh',
      backgroundColor: 'rgb(56, 59, 61)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const color ={
    color: 'green'
  }
  const account = {
    width: '299px',
    height: '65%',
    backgroundColor: 'rgb(206, 206, 236)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    color: 'black',
    gap: '9px',
    marginLeft: '300px',
    display: 'flex',
    padding: '12px 0px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
  const [emps, setEmps] = useState([]);
  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get(`${url}/employee-once/${EmpID}`);
        setEmps(res.data);
      } catch (error) {
      }
    };
    fetchEmp();
  }, []);

  const [update, setUpdate] = useState({
    username: '',
    password: '',
  });

  const location = useLocation();


  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const EmpID = localStorage.getItem("userID");
  const handleUpdate = async (event) => {
    try {
      await axios.put(`${url}/employee/${EmpID}`, update);
      setEmps((prevEmps) => {
        prevEmps.forEach((emp, index) => {
          if (emp.id === EmpID) {
            prevEmps[index] = { ...emp, ...update };
          }
        });
        return [...prevEmps];
      });
      setVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [visible, setVisible] = useState(false);

  return (
    <div className='account-container-admin'>
      {emps.map((emp) => (
        <div key={emp.id} style={account}>
          <h1>{emp.username}</h1>
          <img src={emp.profile_picture} id='profile_picture' alt="" />
          <p>Username: {emp.username}</p>
          <p>Password: {emp.password}</p>
          <p>Role: {emp.role_name}</p>
          <p>Department: {emp.department_name}</p>
          <p>Status:  <span style={color}>{emp.status}</span></p>
          <button onClick={() => setVisible(true)}>Update</button>
          <Model isOpen={visible} onRequestClose={() => setVisible(false)} style={modal}>
            <h1>Update</h1>
            <input type='text' placeholder='Username' name="username" onChange={handleChange} />
            <input type='text' placeholder='Password' name="password" onChange={handleChange} />
            <button onClick={() => handleUpdate(emp.id)}>Submit</button>
          </Model>
        </div>
      ))}
      </div>
  );
}

export default AccountAdmin;
