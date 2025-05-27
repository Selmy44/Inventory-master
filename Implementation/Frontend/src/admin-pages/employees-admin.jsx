
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import DataTable from 'react-data-table-component';
import Model from 'react-modal';
import Modal from 'react-modal';
import ImgAdd from '../images/add-photo.svg';
import Switch from 'react-switch'
import ClipLoader from "react-spinners/ClipLoader";
import Add from '../images/add.svg'
import Info from '../images/info.svg'
import ProfilePicture from '../images/profile-picture.svg';
import '../style.css'
import NavbarAdmin from './navbarAdmin';
import Update from '../images/update.svg';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import keys from '../keys';


function EmployeesAdmin() {

  const url = keys.REACT_APP_BACKEND;

  const modal = {
    overlay: {
      display: 'flex',
      zIndex: '20',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '20'
    },
    content: {
      // margin: '0px',
      width: '33%',
      marginLeft: '495px',
      marginTop: '-30px',
      height: '98vh',
      backgroundColor: 'rgb(206, 206, 236)',
      border: 'none',
      borderRadius: '12px',
      gap: '20px',
      color: "black",
      padding: '12px 0px',
      fontFamily: 'Arial, sans- serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const modalEmployee = {
    overlay: {
      display: 'flex',
      zIndex: '20',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '20'
    },
    content: {
      // margin: '0px',
      width: '33%',
      marginLeft: '495px',
      marginTop: '-20px',
      height: '79%',
      backgroundColor: 'rgb(206, 206, 236)',
      border: 'none',
      borderRadius: '12px',
      gap: '20px',
      color: "black",
      padding: '2px 0px',
      fontFamily: 'Arial, sans- serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const modalUpdate = {
    overlay: {
      display: 'flex',
      zIndex: '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '33%',
      marginLeft: '495px',
      height: '90vh',
      backgroundColor: 'rgb(206, 206, 236)',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      fontFamily: 'Arial, sans- serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const ThemBs = {
    display: 'flex',
    gap: '9px',
    flexDirection: 'row'
  }

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px'
  }

  const [emps, setEmps] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [switchStates, setSwitchStates] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [department, setDepartment] = useState([]);
  const [role, setRole] = useState([]);
  const [roleUpdate, setRoleUpdate] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUpdatedRole, setSelectedUpdatedRole] = useState('');
  const [oneEmployee, setOneEmployee] = useState(false);
  const [sumOne, setSumOne] = useState([]);
  const [selectedUpdateDepartment, setSelectedUpdateDepartment] = useState('');
  const [update, setUpdate] = useState({
    username: '',
    password: '',
    address: '',
    department: '',
    role: '',
    profile_pricture: '',
    status: '',
    email: ''
  });

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await axios.get(`${url}/employees`);
        setEmps(res.data);
      } catch (error) {
      }
    };
    fetchEmp();
  }, []);;


  const handleSwitchChange = async (checked, empID) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [empID]: checked,
    }));

    const status = checked ? 'ACTIVE' : 'DE-ACTIVATED';

    try {
      console.log("Emp ID: ", empID);
      const response = await axios.put(`${url}/deactivate-employee/${empID}`, {
        status,
        employee
      });
      console.log('Backed Said Yes: ');

      setEmps((prevEmps) => {
        return prevEmps.map((emp) => {
          if (emp.id === empID) {
            return { ...emp, status };
          }
          return emp;
        });
      });
    } catch (error) {
      console.error('Error updating data: ', error);
    }

  };

  const handleChange = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };


  useEffect(() => {
    setUpdate(prevUpdate => ({
      ...prevUpdate,
      roleName: selectedUpdatedRole,
      departmentName: selectedUpdateDepartment,
    }))
  }, [selectedUpdatedRole, selectedUpdateDepartment])

  const handleUpdate = async (EmpID) => {
    console.log("SELECTED EMPLOYEE ID: ", EmpID);
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

  const handleChange2 = (event) => {
    setEmployee((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };


  const bringOneEmployee = async (id) => {
    try {
      const response = await axios.get(`${url}/employee-once/${id}`);
      setSumOne(response.data);
    } catch (error) {
      console.error("Error: ", error);
    }

  }

  const [placeholder, setPlaceholder] = useState([])

  const openInfoModal = (id, row) => {
    setPlaceholder(row)
    bringOneEmployee(id);
    fetchImageURL(id)
    setOneEmployee(true);
  };

  const closeInfoModal = () => {
    setOneEmployee(false);
  };

  const empsColumn = [
    {
      name: 'Name',
      selector: row => row.username
    },

    {
      name: 'Role',
      selector: row => row.role_name
    },
    {
      name: 'View',
      cell: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id, row)}><img src={Info} style={svgStyle} /></button>
      )
    },
  ];

  const some = {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)',
    justifyContent: 'center',
    overflow: 'auto',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  }

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

  useEffect(() => {
    const getDept = async () => {
      const response = await axios.get(`${url}/get-department/`);
      setDepartment(response.data);
    };
    getDept()
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for Department", typeof selectedValue);
    setSelectedDepartment(selectedValue);
  }

  const handleUpdateDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for Department", typeof selectedValue);
    setSelectedUpdateDepartment(selectedValue);
  }

  const Select = {
    width: '65%',
    height: '48%',
    color: 'black',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '21px'
  };

  useEffect(() => {
    const fetchRole = async (selectedDepartment) => {
      const response = await axios.get(`${url}/get-role/${selectedDepartment}`);
      setRole(response.data);
      console.log("DATA: ", response.data)
    }
    if (selectedDepartment) {
      fetchRole(selectedDepartment);
    }
  }, [selectedDepartment])

  useEffect(() => {
    const fetchRole = async (selectedUpdateDepartment) => {
      const response = await axios.get(`${url}/get-role/${selectedUpdateDepartment}`);
      setRoleUpdate(response.data);
      console.log("DATA: ", response.data)
    }
    if (selectedUpdateDepartment) {
      fetchRole(selectedUpdateDepartment);
    }
  }, [selectedUpdateDepartment])

  const handleRoleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for role", typeof selectedValue);
    setSelectedRole(selectedValue);
  };

  const handleUpdateRoleChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN for role", typeof selectedValue);
    setSelectedUpdatedRole(selectedValue);
  };

  const OptionColor = {
    width: '39%',
    height: '25%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  }

  const [employee, setEmployee] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    address: '',
    departmentName: '',
    roleName: '',
    email: '',
    date_of_employment:''
  })
  useEffect(() => {
    setEmployee(prevEmployee => ({
      ...prevEmployee,
      departmentName: selectedDepartment,
      roleName: selectedRole,
    }));
  }, [selectedDepartment, selectedRole]);


  const handleMake = async (event) => {

    try {
      console.log("Passing Data: ", employee)
      const response = await axios.post(`${url}/employee`, employee);
      const newEmployeeID = response.data;

      if (imageUpload == null) return;
      const IdForQuotation = newEmployeeID;
      console.log("ID FOR QUOTATION: ", IdForQuotation);
      const imageRef = ref(storage, `employeesProfilePictures/${imageUpload.name, IdForQuotation}`);
      uploadBytes(imageRef, imageUpload).then(() => {
      });

      setInterval(() => {
        closeCreateModal();
      }, 2700);

      setAddVisible(false);

    } catch (error) {
      console.log('Error', error)
    };
  };

  const Kaine = {
    width: '100%',
    height: '100vh',
    backgroundColor: 'rgb(163, 187, 197)'
  };

  const MakeBig = {
    width: '90%',
    marginLeft: '15%'
  };

  const One = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'inline',
    gap: '12px'
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

  const [createModal, setCreateModal] = useState(false);

  const openCreateModal = () => {
    setCreateModal(true);
    handleMake();
  };

  const closeCreateModal = () => {
    setCreateModal(false);
  };

  const fetchImageURL = async (ID) => {
    try {
      if (ID) {
        console.log("ID PROVIDED: ", ID)
        const imageRef = ref(storage, `employeesProfilePictures/${ID}`);
        const imageURL = await getDownloadURL(imageRef);
        setImageURL(imageURL);
      };
    } catch (error) {
      if (error) {
        setImageURL('');
        console.error("Error: ", error);
      }
    };
  };

  const [trial, setTrial] = useState('');

  useEffect(() => {
    const functions = () => {
      try {
        const sumn = 'sumn';
        setTrial(sumn);
      } catch (error) {
        console.error("Error: ", error);
      };
    };
    functions();
  }, []);

  const style = {
    backgroundColor: 'black',
    width: '1%',
    height: '1%'
  };

  const [records, setRecords] = useState([]);

  const handleFilter = (event) => {
    const newData = emps.filter((row) => {
      return row.username.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  useEffect(() => {
    setRecords(emps);
  }, [emps]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={Kaine}>
        <div style={kain}>
          <div style={MakeBig}>
            <div style={One}>
              <h1>List Of Employees</h1>
              <button className='addItem-btn1' onClick={() => setAddVisible(true)} ><img src={Add} style={svgStyle} /></button>
              <input type='text' placeholder='Search For An Employee' onChange={handleFilter} />
            </div>
        
            <div style={{ width: '90%', marginTop: '9px', height: 'auto', borderRadius: '12px'}}>
            <DataTable
              columns={empsColumn}
              data={records}
              pagination
            ></DataTable>
            </div>

          </div>
        </div>

        <br />

        <div style={some}>
          <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
            <h2>Adding a new Employee</h2>
            <input type='text' placeholder='Username' name='username' onChange={handleChange2} />
            <input type='text' placeholder='Password' name='password' onChange={handleChange2} />
            <input type='text' placeholder='Address eg: Kigali - Kicukiro' name='address' onChange={handleChange2} />
            <input type='text' placeholder='Phone Number' name='phone_number' onChange={handleChange2} />

            <select onChange={handleDepartmentChange} value={selectedDepartment} style={Select}>
              <option value='' disabled>Select Department</option>
              {department.map(departments => (
                <option key={departments.id} value={departments.id}>{departments.department_name}</option>
              ))}
            </select>

            <select onChange={handleRoleChange} value={selectedRole} style={Select}>
              <option value='' disabled>Select Role</option>
              {role.map(roles => (
                <option key={roles.id} value={roles.id} style={OptionColor}>{roles.role_name}</option>
              ))}
            </select>
            <input type='email' placeholder='Work-Related email' name='email' onChange={handleChange2} />

            <div style={{ display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
              <p>Attach Picture ID (Not required)</p>
              <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', color: 'white', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
                <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
              </label>
            </div>
            <div style={{  display: 'flex', justifyContent: 'center', gap: '14px', width: '80%' }}>
            <p>Date Of Employment: </p>  <input type='date' name='date_of_employment'  id='smallDate' style={{ width: '40%', borderRadius: '20px', display: 'flex', justifyContent:'center', border: 'none' }} onChange={handleChange2} />
            </div>

            <button className='buttonStyle2' onClick={openCreateModal}>Submit</button>
          </Model >

          <Modal isOpen={oneEmployee} onRequestClose={closeInfoModal} style={modalEmployee}>
            {sumOne.map((emp) => (
              <div key={emp.id} className="employee">
                <h1>{emp.username}</h1>

                {imageURL ? (
                  <img src={imageURL} style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }} />

                ) : <img src={ProfilePicture} style={{ maxWidth: '90%', maxHeight: '15vh', borderRadius: '60px' }} />}

                <p>Username: {emp.username}</p>
                <p>Password: *******</p>
                <p>Address: {emp.address}</p>
                <p>Position: {emp.role_name}</p>
                <p>Department: {emp.department_name}</p>
                <p>Email: {emp.email}</p>
                <p>Date Of Employment: {formatDate(emp.date_of_employment)}</p>
                <p>Status:  <span style={{ color: emp.status === 'DE-ACTIVATED' ? 'red' : 'green' }}>{emp.status}</span></p>
                <div style={ThemBs}>
                  <button className='addItem-btn' onClick={() => setVisible(true)}><img src={Update} style={svgStyle} /></button>
                  <Switch onChange={(checked) => handleSwitchChange(checked, emp.id)} checked={switchStates[emp.id] || false} />
                </div>

                <Modal isOpen={visible} onRequestClose={() => setVisible(false)} style={modalUpdate}>
                  <h1>Update</h1>
                  <input type='text' placeholder={placeholder.username} name="username" onChange={handleChange} />
                  <input type='text' placeholder={placeholder.password} name="password" onChange={handleChange} />
                  <input type='text' placeholder={placeholder.address} name="address" onChange={handleChange} />
                  <select onChange={handleUpdateDepartmentChange} value={selectedUpdateDepartment} style={Select}>
                    <option value='' disabled >Select Department</option>
                    {department.map(departments => (
                      <option key={departments.id} value={departments.id} >{departments.department_name}</option>
                    ))}
                  </select>

                  <select onChange={handleUpdateRoleChange} value={selectedUpdatedRole} style={Select}>
                    <option value='' disabled>Select Role</option>
                    {roleUpdate.map(roles => (
                      <option key={roles.id} value={roles.id} style={OptionColor}>{roles.role_name}</option>
                    ))}
                  </select>
                  <input type='email' placeholder={placeholder.email} name='email' onChange={handleChange} />

                  <div style={{ color: 'black', display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
                    <p>Attach New Picture ID (Not required)</p>
                    <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
                      <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                      {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
                    </label>
                  </div>
                  <button onClick={() => handleUpdate(emp.id)}>Submit</button>
                </Modal>
              </div>
            ))}
          </Modal>

          <Modal isOpen={createModal} onRequestClose={closeCreateModal} className={modal}>
            <div style={{ display: 'flex', zIndex: '20', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
              <ClipLoader color={'green'} loading={loading} size={89} />
              <div>
                <p>Creating An Employee...</p>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
}

export default EmployeesAdmin;
