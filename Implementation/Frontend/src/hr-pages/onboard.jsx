import React, { useState, useEffect } from 'react';
import NavbarMain from './navbarMain';

import axios from "axios";
import DataTable from 'react-data-table-component';
import Add from '../images/add.svg'
import Modal from 'react-modal';

import ClipLoader from "react-spinners/ClipLoader";
import Info from '../images/info.svg'
import ProfilePicture from '../images/profile-picture.svg';
import '../style.css'

import { storage } from '../firebase';
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import Logo from '../images/logo.svg';
import keys from '../keys';
import Left from '../images/left-arrow.svg';
import Right from '../images/right-arrow.svg';
import Delete from '../images/delete.svg';


function Onboard() {

  const url = keys.REACT_APP_BACKEND;

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '83%',
      margin: 'auto',
      height: '84vh',
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

  const personal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '20'
    },
    content: {
      width: '83%',
      margin: 'auto',
      height: '84vh',
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
      // alignItems: 'center',
    },
  }

  const modalUpdate = {
    overlay: {
      display: 'flex',
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
  }

  const arrows = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const attendant = {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'inline',
  }

  const [emps, setEmps] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [switchStates, setSwitchStates] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
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
        const res = await axios.get(`${url}/get-attendants`);
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

  const [currentAttendantID, setCurrentAttendantID] = useState('');

  const bringOneAttendant = async (id) => {
    try {
      const response = await axios.get(`${url}/attendee-once/${id}`);
      setCurrentAttendantID(response.data[0].id);
      setSumOne(response.data);
    } catch (error) {
      console.error("Error: ", error);
    };
  };

  const openInfoModal = (id) => {
    bringOneAttendant(id);
    fetchImageURL(id);
    setOneEmployee(true);
  };

  const closeInfoModal = () => {
    setImageURL('');
    setOneEmployee(false);
  };

  const empsColumn = [
    {
      name: 'Name',
      selector: row => row.first_name
    },

    {
      name: 'Last Name',
      selector: row => row.third_name
    },
    {
      name: 'Email',
      selector: row => row.email
    },

    {
      name: 'Date Of Employment',
      selector: row => row.date_of_employment
    },
    {
      name: 'Work Place',
      selector: row => row.place_of_work
    },

    {
      name: 'Role',
      selector: row => row.role_name
    },
    {
      name: 'View',
      cell: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id)}><img src={Info} style={svgStyle} /></button>
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
    height: '12%',
    marginTop: '12px',
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
    address: '',
    departmentName: '',
    roleName: '',
    email: '',
    date_of_employment: ''
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

  const closeCreateModal = () => {
    setCreateModal(false);
  };

  const fetchImageURL = async (ID) => {
    try {
      if (ID) {
        console.log("ID PROVIDED: ", ID)
        const imageRef = ref(storage, `attendantProfilePicture/${ID}`);
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


  const handleFilter = (event) => {
    const newData = emps.filter((row) => {
      return row.first_name.toLowerCase().includes(event.target.value.toLowerCase());
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

  const holder = {
    width: '80%',
    height: '85%',
    borderRadius: '12px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '400px'
  };

  const holderx = {
    width: '100%',
    height: '85%',
    borderRadius: '12px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column',
    height: '400px'
  };

  const buttx = {
    width: '40%',
    height: '60px',
    display: 'flex',
    borderRadius: '30px',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const text = {
    width: '60%',
    height: '15%',
    border: 'none',
    borderBottom: '4px solid rgb(16, 232, 106)',
    color: 'black',
    outline: 'none',
    backgroundColor: 'white',
  }

  const [tab, setTab] = useState(1);
  const [animationClass, setAnimationClass] = useState('');
  const [animationClassx, setAnimationClassx] = useState('');
  const [attendantFirstName, setAttendantFirstName] = useState('');
  const [attendantSecondName, setAttendantSecondName] = useState('');
  const [attendantThirdName, setAttendantThirdName] = useState('');
  const [attendantAddress, setAttendantAddress] = useState('');
  const [attendantPhoneNumber, setAttendantPhoneNumber] = useState('')
  const [attendantNationality, setAttendantNationality] = useState('')
  const [attendantEmail, setAttendantEmail] = useState('')
  const [attendantBirthDate, setAttendantBirthDate] = useState('')
  const [attendantHeight, setAttendantHeight] = useState('');
  const [attendantDrivingLicense, setAttendantDrivingLicense] = useState('');
  const [attendantTaxIdentificationID, setAttendantTaxIdentificationID] = useState('');
  const [attendantEmploymentStatus, setAttendantEmploymentStatus] = useState('');
  const [attendantPassportNumber, setAttendantPassportNumber] = useState('');
  const [attendantDisability, setAttendantDisability] = useState('');
  const [attendantMaritalStatus, setAttendantMaritalStatus] = useState('');
  const [spouseFirstName, setSpouseFirstName] = useState('');
  const [spouseSecondName, setSpouseSecondName] = useState('');
  const [spouseThirdName, setSpouseThirdName] = useState('');
  const [spousePhoneNumber, setSpousePhoneNumber] = useState('');
  const [spouseDateOfBirth, setSpouseDateOfBirth] = useState('');
  const [spouseEmail, setSpouseEmail] = useState('');
  const [spouseOccupation, setSpouseOccupation] = useState('');
  const [spouseAddress, setSpouseAddress] = useState('');
  const [spouseNumberOfChildren, setSpouseNumberOfChildren] = useState('');
  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherSecondName, setFatherSecondName] = useState('');
  const [fatherThirdName, setFatherThirdName] = useState('')
  const [fatherPhoneNumber, setFatherPhoneNumber] = useState('')
  const [fatherDateOfBirth, setFatherDateOfBirth] = useState('')
  const [motherFirstName, setMotherFirstName] = useState('')
  const [motherSecondName, setMotherSecondName] = useState('')
  const [motherThirdName, setMotherThirdName] = useState('')
  const [motherPhoneNumber, setMotherPhoneNumber] = useState('');
  const [motherDateOfBirth, setMotherDateOfBirth] = useState('')
  const [emergencyFirstName, setEmergencyFirstName] = useState('');
  const [emergencySecondName, setEmergencySecondName] = useState('');
  const [emergencyThirdName, setEmergencyThirdName] = useState('');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [emergencyEmail, setEmergencyEmail] = useState('');
  const [academicQualification1, setAcademicQualifications1] = useState('');
  const [academicQualification2, setAcademicQualifications2] = useState('');
  const [academicQualification3, setAcademicQualifications3] = useState('');
  const [academicQualification4, setAcademicQualifications4] = useState('');
  const [academicQualification5, setAcademicQualifications5] = useState('');
  const [institution1, setInstitution1] = useState('')
  const [institution2, setInstitution2] = useState('')
  const [institution3, setInstitution3] = useState('')
  const [institution4, setInstitution4] = useState('')
  const [institution5, setInstitution5] = useState('')
  const [dateObtained1, setDateObtained1] = useState('');
  const [dateObtained2, setDateObtained2] = useState('');
  const [dateObtained3, setDateObtained3] = useState('');
  const [dateObtained4, setDateObtained4] = useState('');
  const [dateObtained5, setDateObtained5] = useState('');
  const [relativeName, setRelativeName] = useState('');
  const [relativeRelationship, setRelativeRelationship] = useState('');
  const [relativeDepartment, setRelativeDepartment] = useState('');
  const [relativeBranch, setRelativeBranch] = useState('');
  const [relativeLatestOrganization, setRelativeLatestOrganization] = useState('');
  const [relativeJobTitle, setRelativeJobTitle] = useState('');
  const [relativeFromDate, setRelativeFromDate] = useState('');
  const [relativeCompanyName, setRelativeCompanyName] = useState('');
  const [relativePhoneNumber, setRelativePhoneNumber] = useState('');
  const [whyarrestdetaineddeportedanyauthorityabroad, setwhyArrestdetaineddeportedanyauthorityabroad] = useState('')
  const [anyreasonfordischargefrompreviousposition, setAnyreasonfordischargefrompreviousposition] = useState('');
  const [addressAnyReasonForLeave, setAddressAnyReasonForLeave] = useState('');
  const [attendantPlaceOfWork, setAttendantPlaceOfWork] = useState('');
  const [attendantDOE, setAttendantDOE] = useState('');
  const [tabx, setTabx] = useState(1);


  const numberOfTabs = 9;
  const numberOfTabsx = 8;

  const handlePrev = () => {
    setAnimationClass('slide-left');
    setTab((prev) => (prev > 1 ? prev - 1 : numberOfTabs));
  };

  const handleNext = () => {
    setAnimationClass('slide-right');
    setTab((prev) => (prev < numberOfTabs ? prev + 1 : 1));
  };

  // Reset animation class to allow re-triggering

  const resetAnimation = () => {
    setAnimationClass('');
  };

  const resetAnimationx = () => {
    setAnimationClassx('');
  };

  const handlePrevx = () => {
    setAnimationClassx('slide-left');
    setTabx((prev) => (prev > 1 ? prev - 1 : numberOfTabsx));
  };

  const handleNextx = () => {
    setAnimationClassx('slide-right');
    setTabx((prev) => (prev < numberOfTabsx ? prev + 1 : 1));
  };

  const [nextAttendantID, setNextAttendantID] = useState('');
  const [CVUpload, setCVUpload] = useState(null);
  const [CVFile, setCVFile] = useState('');
  const [CVUrl, setCVUrl] = useState('');


  const [otherFilesUpload, setOtherFilesUpload] = useState(null);
  const [otherFilesFile, setOtherFilesFile] = useState('');
  const [otherFilesUrl, setOtherFilesUrl] = useState('');

  const updateFileNameCV = (event) => {
    const selectedCVFile = event.target.files[0];
    setCVUpload(selectedCVFile);

    const fileName = selectedCVFile ? selectedCVFile.name : 'No file Chosen';
    setCVFile(fileName);
    const reader = new FileReader();
    reader.onload = () => {
      setCVUrl(reader.result);
    };
    if (selectedCVFile) {
      reader.readAsDataURL(selectedCVFile)
    }
  };

  const updateFileNameOtherDocs = (event) => {
    const selectedOtherDocs = event.target.files[0];
    setOtherFilesUpload(selectedOtherDocs);

    const fileName = selectedOtherDocs ? selectedOtherDocs.name : 'No file Chosen';
    setOtherFilesFile(fileName);
    const reader = new FileReader();
    reader.onload = () => {
      setOtherFilesUrl(reader.result);
    };

    if (selectedOtherDocs) {
      reader.readAsDataURL(selectedOtherDocs);
    }


  };

  const onboardFunction = async () => {

    const attendant = [
      attendantFirstName,
      attendantSecondName,
      attendantThirdName,
      attendantNationality,
      attendantEmail,
      attendantAddress,
      attendantPhoneNumber,
      attendantBirthDate,
      attendantHeight,
      attendantPassportNumber,
      attendantDrivingLicense,
      attendantTaxIdentificationID,
      attendantEmploymentStatus,
      selectedDepartment,
      selectedRole,
      attendantDisability,
      attendantMaritalStatus,
      attendantPlaceOfWork,
      attendantDOE
    ];

    const spouse = [
      nextAttendantID,
      spouseFirstName,
      spouseSecondName,
      spouseThirdName,
      spousePhoneNumber,
      spouseDateOfBirth,
      spouseEmail,
      spouseOccupation,
      spouseAddress,
      spouseNumberOfChildren
    ];

    const familyInformation = [
      nextAttendantID,
      fatherFirstName,
      fatherSecondName,
      fatherThirdName,
      fatherPhoneNumber,
      fatherDateOfBirth,
      motherFirstName,
      motherSecondName,
      motherThirdName,
      motherPhoneNumber,
      motherDateOfBirth
    ];

    const emergencyContact = [
      nextAttendantID,
      emergencyFirstName,
      emergencySecondName,
      emergencyThirdName,
      emergencyPhoneNumber,
      emergencyEmail,
    ];

    const academic = [
      nextAttendantID,
      institution1,
      institution2,
      institution3,
      institution4,
      institution5,
      dateObtained1,
      dateObtained2,
      dateObtained3,
      dateObtained4,
      dateObtained5,
      academicQualification1,
      academicQualification2,
      academicQualification3,
      academicQualification4,
      academicQualification5,
    ];

    const relative = [
      nextAttendantID,
      relativeName,
      relativeRelationship,
      relativeDepartment,
      relativeBranch,
      relativeLatestOrganization,
      relativeJobTitle,
      relativeFromDate,
      relativeCompanyName,
      relativePhoneNumber,
    ];

    const employmentHistory = [
      nextAttendantID,
      whyarrestdetaineddeportedanyauthorityabroad,
      anyreasonfordischargefrompreviousposition,
      addressAnyReasonForLeave
    ]


    const sendAttendant = axios.post(`${url}/send-attendant`, attendant);
    const sendSpouse = axios.post(`${url}/send-spouse`, spouse);
    const sendFamilyInfo = axios.post(`${url}/send-family-information`, familyInformation);
    const sendAcademic = axios.post(`${url}/send-academic`, academic);
    const sendRelative = axios.post(`${url}/send-relative`, relative);
    const sendEmergencyContact = axios.post(`${url}/send-emergency-contact`, emergencyContact);
    const sendEmploymentHistory = axios.post(`${url}/send-employment-history`, employmentHistory);
    // 
    Promise.all([sendAttendant, sendSpouse, sendFamilyInfo, sendAcademic, sendRelative, sendEmploymentHistory, sendEmergencyContact])
      // Promise.all([sendEmergencyContact])
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error("Error: ", err);
      });

    console.log("PDF CV Got in function:", CVUpload);


    if (imageUpload == null) return;
    const IdForQuotation = nextAttendantID;
    console.log("Profile Picture Got: ", IdForQuotation);
    const imageRef = ref(storage, `attendantProfilePicture/${imageUpload.name, IdForQuotation}`);
    uploadBytes(imageRef, imageUpload).then(() => { });

    if (CVUpload == null) return;
    console.log("PDF CV Got", nextAttendantID);
    const CVRef = ref(storage, `attendantCV/${CVUpload.name, nextAttendantID}`);
    uploadBytes(CVRef, CVUpload).then(() => { });

    if (otherFilesUpload == null) return;
    console.log("Other Files Got", otherFilesUpload);
    const otherFilesRef = ref(storage, `otherDocsAttendant/${otherFilesUpload.name, nextAttendantID}`)
    uploadBytes(otherFilesRef, otherFilesUpload).then(() => { })
  };


  const handleDeleteEntireAttendant = async (currentAttendantID) => {
    try {
      console.log("ID Passed:", currentAttendantID);
      const response = await axios.delete(`${url}/delete-entire-attendant/${currentAttendantID}`);

      const imageRef = ref(storage, `attendantProfilePicture/${currentAttendantID}`);
      const CVRef = ref(storage, `attendantCV/${currentAttendantID}`);
      const otherFilesRef = ref(storage, `otherDocsAttendant/${currentAttendantID}`);

      await deleteObject(CVRef);
      await deleteObject(imageRef);
      await deleteObject(otherFilesRef);

      console.log("reponse:", response.data);

    } catch (error) {
      console.error("Error: ", error);
    };
  };



  useEffect(() => {
    const func = async () => {
      try {
        const response = await axios.get(`${url}/get-next-attendant-id`)
        console.log("Here: ", response.data.latest_id + 1);
        const nextAttendantID = response.data.latest_id + 1;
        setNextAttendantID(nextAttendantID);

      } catch (error) {
        console.error("Error: ", error);
      }
    }
    func();
  }, [])

  return (
    <div>
      <NavbarMain></NavbarMain>
      <div style={Kaine}>
        <div style={kain}>
          <div style={MakeBig}>
            <div style={One}>
              <h1>List Of Employees</h1>
              <button className='addItem-btn1' onClick={() => setAddVisible(true)} ><img src={Add} style={svgStyle} /></button>
              <input type='text' placeholder='Search For An Employee' onChange={handleFilter} />
            </div>
            <br />
            <div style={{ width: '90%', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '9px', borderRadius: '12px' }}>
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

          <Modal isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
            <div
              className={animationClass}
              style={holder}
              onAnimationEnd={resetAnimation} // Reset animation class after animation ends
            >
              {tab === 1 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Personal Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setAttendantFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' onChange={(e) => setAttendantSecondName(e.target.value)} />
                      <input placeholder='Third Name' style={text} type='text' onChange={(e) => setAttendantThirdName(e.target.value)} />
                      <input placeholder='Phone (Drop)' style={text} type='text' onChange={(e) => setAttendantPhoneNumber(e.target.value)} />
                      <input placeholder='Nationality' style={text} type='text' onChange={(e) => setAttendantNationality(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Email' style={text} type='text' onChange={(e) => setAttendantEmail(e.target.value)} />
                      <input placeholder='Address' style={text} type='text' onChange={(e) => setAttendantAddress(e.target.value)} />
                      <input placeholder='Birth Date' style={text} type='text' onChange={(e) => setAttendantBirthDate(e.target.value)} />
                      <input placeholder='Phone Number' style={text} type='text' onChange={(e) => setAttendantFirstName(e.target.value)} />
                      <input placeholder='Height' style={text} type='text' onChange={(e) => setAttendantHeight(e.target.value)} />
                    </div>
                  </div>

                </div>
              }
              {tab === 2 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Personal Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Passport Number' style={text} type='text' onChange={(e) => setAttendantPassportNumber(e.target.value)} />
                      <input placeholder='Driving License ID' style={text} type='text' onChange={(e) => setAttendantDrivingLicense(e.target.value)} />
                      <input placeholder='Tax Identification ID' style={text} type='text' onChange={(e) => setAttendantTaxIdentificationID(e.target.value)} />
                      <input placeholder='Employment Status' style={text} type='text' onChange={(e) => setAttendantEmploymentStatus(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <select onChange={handleDepartmentChange} value={selectedDepartment} style={Select}>
                        <option value='' disabled >Select Department</option>
                        {department.map(departments => (
                          <option key={departments.id} value={departments.id} >{departments.department_name}</option>
                        ))}
                      </select>

                      <select onChange={handleRoleChange} value={selectedRole} style={Select}>
                        <option value='' disabled>Select Role</option>
                        {role.map(roles => (
                          <option key={roles.id} value={roles.id} style={OptionColor}>{roles.role_name}</option>
                        ))}
                      </select>
                      <input placeholder='Disability' style={text} type='text' onChange={(e) => setAttendantDisability(e.target.value)} />
                      <input placeholder='Marital Status' style={text} type='text' onChange={(e) => setAttendantMaritalStatus(e.target.value)} />
                    </div>
                  </div>

                </div>
              }

              {tab === 3 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Spouse Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setSpouseFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' onChange={(e) => setSpouseSecondName(e.target.value)} />
                      <input placeholder='Third Name' style={text} type='text' onChange={(e) => setSpouseThirdName(e.target.value)} />
                      <input placeholder='Phone Number' style={text} type='text' onChange={(e) => setSpousePhoneNumber(e.target.value)} />
                      <input placeholder='Date Of Birth' style={text} type='text' onChange={(e) => setSpouseDateOfBirth(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Email' style={text} type='text' onChange={(e) => setSpouseEmail(e.target.value)} />
                      <input placeholder='Occupation' style={text} type='text' onChange={(e) => setSpouseOccupation(e.target.value)} />
                      <input placeholder='Address' style={text} type='text' onChange={(e) => setSpouseAddress(e.target.value)} />
                      <input placeholder='Number of Children' style={text} type='text' onChange={(e) => setSpouseNumberOfChildren(e.target.value)} />
                    </div>
                  </div>

                </div>
              }
              {tab === 4 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Family Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Father First Name' style={text} type='text' onChange={(e) => setFatherFirstName(e.target.value)} />
                      <input placeholder='Father Second Name' style={text} type='text' onChange={(e) => setFatherSecondName(e.target.value)} />
                      <input placeholder='Father Third Name' style={text} type='text' onChange={(e) => setFatherThirdName(e.target.value)} />
                      <input placeholder='Father Phone Number' style={text} type='text' onChange={(e) => setFatherPhoneNumber(e.target.value)} />
                      <input placeholder='Father Date Of Birth' style={text} type='text' onChange={(e) => setFatherDateOfBirth(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Mother First Name' style={text} type='text' onChange={(e) => setMotherFirstName(e.target.value)} />
                      <input placeholder='Mother Second Name' style={text} type='text' onChange={(e) => setMotherSecondName(e.target.value)} />
                      <input placeholder='Mother Third Name' style={text} type='text' onChange={(e) => setMotherThirdName(e.target.value)} />
                      <input placeholder='Mother Phone Number' style={text} type='text' onChange={(e) => setMotherPhoneNumber(e.target.value)} />
                      <input placeholder='Mother Date Of Birth' style={text} type='text' onChange={(e) => setMotherDateOfBirth(e.target.value)} />
                    </div>
                  </div>

                </div>
              }

              {tab === 5 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Emergency Contact Information</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='First Name' style={text} type='text' onChange={(e) => setEmergencyFirstName(e.target.value)} />
                      <input placeholder='Second Name' style={text} type='text' onChange={(e) => setEmergencySecondName(e.target.value)} />
                      <input placeholder='Third Name' style={text} type='text' onChange={(e) => setEmergencyThirdName(e.target.value)} />
                      <input placeholder='Phone Number' style={text} type='text' onChange={(e) => setEmergencyPhoneNumber(e.target.value)} />
                      <input placeholder='Email' style={text} type='text' onChange={(e) => setEmergencyEmail(e.target.value)} />
                    </div>

                  </div>

                </div>
              }

              {tab === 6 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Academic And Professional Qualifications</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setAcademicQualifications1(e.target.value)} />
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setAcademicQualifications2(e.target.value)} />
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setAcademicQualifications3(e.target.value)} />
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setAcademicQualifications4(e.target.value)} />
                      <input placeholder='Academic Qualification' style={text} type='text' onChange={(e) => setAcademicQualifications5(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '55%', gap: '25px' }}>
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setInstitution1(e.target.value)} />
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setInstitution2(e.target.value)} />
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setInstitution3(e.target.value)} />
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setInstitution4(e.target.value)} />
                      <input placeholder='Institution' style={text} type='text' onChange={(e) => setInstitution5(e.target.value)} />
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setDateObtained1(e.target.value)} />
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setDateObtained2(e.target.value)} />
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setDateObtained3(e.target.value)} />
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setDateObtained4(e.target.value)} />
                      <input placeholder='Date Obtained' style={text} type='text' onChange={(e) => setDateObtained5(e.target.value)} />
                    </div>
                  </div>

                </div>
              }

              {tab === 7 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Employment History</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>
                        Are any of your relatives, family friends or close friends employed by your current employer?
                        if Yes, indicate
                      </p>

                      <input placeholder='Name' style={text} type='text' onChange={(e) => setRelativeName(e.target.value)} />
                      <input placeholder='Relationship' style={text} type='text' onChange={(e) => setRelativeRelationship(e.target.value)} />
                      <input placeholder='Department' style={text} type='text' onChange={(e) => setRelativeDepartment(e.target.value)} />
                      <input placeholder='Branch' style={text} type='text' onChange={(e) => setRelativeBranch(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Latest Organization' style={text} type='text' onChange={(e) => setRelativeLatestOrganization(e.target.value)} />
                      <input placeholder='Job Title' style={text} type='text' onChange={(e) => setRelativeJobTitle(e.target.value)} />
                      <input placeholder='From Date' style={text} type='text' onChange={(e) => setRelativeFromDate(e.target.value)} />
                      <input placeholder='Company Name' style={text} type='text' onChange={(e) => setRelativeCompanyName(e.target.value)} />
                      <input placeholder='Phone Number' style={text} type='text' onChange={(e) => setRelativePhoneNumber(e.target.value)} />
                    </div>
                  </div>

                </div>
              }
              {tab === 8 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Employment History</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline', gap: '20px' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>
                        Have you ever been arrested / detained / deported by any Police / Military / Authority either in Rwanda or abroad?
                        if Yes State why
                      </p>

                      <textarea placeholder='Reason' style={text} type='text' onChange={(e) => setwhyArrestdetaineddeportedanyauthorityabroad(e.target.value)}></textarea>
                      <p>Have you ever been discharged or been forced to resign for misconduct or unsatisfactory service from any position?
                        If yes say why
                      </p>
                      <textarea placeholder='Reason' style={text} type='text' onChange={(e) => setAnyreasonfordischargefrompreviousposition(e.target.value)}></textarea>

                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <p>Address Reason For Leaving</p>
                      <textarea placeholder='Reason' style={text} type='text' onChange={(e) => setAddressAnyReasonForLeave(e.target.value)}></textarea>

                    </div>
                  </div>

                </div>
              }

              {tab === 9 &&
                <div style={holder}>
                  <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                    <h2>Final Statement</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <input placeholder='Full Name' style={text} type='text' value={attendantFirstName} />
                      <input placeholder='Address' style={text} type='text' value={attendantAddress} />
                      <input placeholder='Contact' style={text} type='text' value={attendantPhoneNumber} />
                      <input placeholder='Place Of Work' style={text} type='text' value={attendantPlaceOfWork} onChange={(e) => setAttendantPlaceOfWork(e.target.value)} />
                      <input placeholder='Date Of Employment (Start Of Contract)' style={text} type='date' value={attendantDOE} onChange={(e) => setAttendantDOE(e.target.value)} />
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                      <label className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Add ID Picture</p>
                        <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                      </label>
                      <label className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Add CV 'PDF'</p>
                        <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileNameCV} />
                      </label>
                      <label className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Other Docs</p>
                        <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileNameOtherDocs} />
                      </label>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%', gap: '25px' }}>
                      <button style={{ backgroundColor: 'green', width: '40%', height: '15%', color: 'white' }} onClick={() => onboardFunction()}>Onboard</button>
                    </div>
                  </div>

                </div>
              }

            </div>


            <div style={{ width: '100%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', flexDirection: 'inline', gap: '12px', }}>
              <div style={{ width: '20%', marginTop: '20px', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px', marginLeft: '297px' }}>
                Slide {tab} of {numberOfTabs}
              </div>
              <div style={{ width: '20%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px', marginLeft: '297px' }}>
                <button style={buttx} onClick={handlePrev}><img src={Left} style={arrows} /></button>
                <button style={buttx} onClick={handleNext}><img src={Right} style={arrows} /></button>
              </div>
            </div>
          </Modal >

          <Modal isOpen={oneEmployee} onRequestClose={closeInfoModal} style={personal}>

            <div style={attendant}>

              <div style={{ width: '30%', height: '117%', backgroundColor: 'white', display: 'flex', marginLeft: '12px', borderRadius: '22px', alignItems: 'center' }}>
                {imageURL ? (
                  <img src={imageURL} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '40vh', borderRadius: '20px' }} />

                ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh', backgroundColor: 'white' }} />}
              </div>

              <div className={animationClassx}
                style={holderx}
                onAnimationEnd={resetAnimationx}
              >
                {tabx === 1 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Personal Information</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>First Name: {attendee.first_name}</p>
                          <p>Second Name:  {attendee.second_name}</p>
                          <p>Third Name: {attendee.third_name}</p>
                          <p>Phone:  {attendee.phone_number}</p>
                          <p>Nationality:  {attendee.nationality}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Email: {attendee.email}</p>
                          <p>Address: {attendee.address}</p>
                          <p>Birth Date: {attendee.birth_date}</p>
                          <p>Phone Number: {attendee.phone_number}</p>
                          <p>Height: {attendee.height}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                }

                {tabx === 2 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Personal Information</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Passport Number: {attendee.passport_number}</p>
                          <p>Driving:  {attendee.driving_license}</p>
                          <p>Tax Identification: {attendee.tax_identificationID}</p>
                          <p>Pre Employment Status:  {attendee.employment_status}</p>
                          <p>Marital Status: {attendee.marital_status}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Department: {attendee.department_name}</p>
                          <p>Role: {attendee.role_name}</p>
                          <p>Birth Date: {attendee.birth_date}</p>
                          <p>Disability: {attendee.disability}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                }

                {tabx === 3 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Spouse Information</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>First Name: {attendee.spouse_first_name}</p>
                          <p>Second Name:  {attendee.spouse_second_name}</p>
                          <p>Third Name: {attendee.spouse_third_name}</p>
                          <p>Phone Number:  {attendee.spouse_phone_number}</p>
                          <p>Date Of Birth:  {attendee.spouse_dob}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Email: {attendee.spouse_email}</p>
                          <p>Occupation: {attendee.spouse_occupation}</p>
                          <p>Address: {attendee.spouse_address}</p>
                          <p>Number of Childrens: {attendee.spouse_number_of_children}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                }

                {tabx === 4 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Family Information</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Father First Name: {attendee.father_first_name}</p>
                          <p>Father Second Name:  {attendee.father_second_name}</p>
                          <p>Father Third Name: {attendee.father_third_name}</p>
                          <p>Father Phone Number:  {attendee.father_phone_number}</p>
                          <p>Father Date Of Birth:  {attendee.father_DOB}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Mother First Name: {attendee.mother_first_name}</p>
                          <p>Mother Second Name:  {attendee.mother_second_name}</p>
                          <p>Mother Third Name: {attendee.mother_third_name}</p>
                          <p>Mother Phone Number:  {attendee.mother_phone_number}</p>
                          <p>Mother Date Of Birth:  {attendee.mother_DOB}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                }

                {tabx === 5 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Emergency Contact</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '100%', gap: '25px' }}>
                          <p>Emergency First Name: {attendee.emergency_contact_first_name}</p>
                          <p>Emergency Second Name:  {attendee.emergency_contact_second_name}</p>
                          <p>Emergency Third Name: {attendee.emergency_contact_third_name}</p>
                          <p>Emergency Phone Number:  {attendee.emergency_contact_phone_number}</p>
                          <p>Emergency Email:  {attendee.emergency_contact_email}</p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
                }

                {tabx === 6 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Academic And Professional Qualification</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '90%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                          <p>Academic Qualification: {attendee.academic_qualification1}</p>
                          <p>Academic Qualification: {attendee.academic_qualification2}</p>
                          <p>Academic Qualification: {attendee.academic_qualification3}</p>
                          <p>Academic Qualification: {attendee.academic_qualification4}</p>
                          <p>Academic Qualification: {attendee.academic_qualification5}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '55%', gap: '25px' }}>
                          <p>Institution: {attendee.institution1}</p>
                          <p>Institution: {attendee.institution2}</p>
                          <p>Institution: {attendee.institution3}</p>
                          <p>Institution: {attendee.institution4}</p>
                          <p>Institution: {attendee.institution5}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                          <p>Date Obtained: {attendee.date_obtained1}</p>
                          <p>Date Obtained: {attendee.date_obtained2}</p>
                          <p>Date Obtained: {attendee.date_obtained3}</p>
                          <p>Date Obtained: {attendee.date_obtained4}</p>
                          <p>Date Obtained: {attendee.date_obtained5}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
                }

                {tabx === 7 && <div>
                  {sumOne.map(attendee => (
                    <div style={holderx}>
                      <div style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center' }}>
                        <h2>Employment History</h2>
                      </div>
                      <div style={{ display: 'flex', marginTop: '1px', height: '70%', borderRadius: '12px', backgroundColor: 'white', width: '100%', flexDirection: 'inline' }}>

                        <div style={{ backgroundColor: 'white', marginTop: '44px', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                          <p>
                            Are any of your relatives, family friends or close friends
                            employed by your current employer?
                            if Yes, indicate: {attendee.relativeName}
                          </p>
                          <p>Name:  {attendee.relativeName}</p>
                          <p>Relationship: {attendee.ralativeRelationship}</p>
                          <p>Department:  {attendee.relativeDepartment}</p>
                          <p>Branch:  {attendee.relativeBranch}</p>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '12px', marginTop: '44px', height: '100%', display: 'flex', flexDirection: 'column', width: '70%', gap: '25px' }}>
                          <p>Latest Organization: {attendee.relativeLatestOrganization}</p>
                          <p>Job Title: {attendee.relativeJobTitle}</p>
                          <p>From Date: {attendee.relativeFromDate}</p>
                          <p>Company Name: {attendee.relativeCompanyName}</p>
                          <p>Phone Number: {attendee.relativePhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                }



              </div>
            </div>
            <br />
            <div style={{ width: '100%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', flexDirection: 'inline', gap: '12px', }}>

              <div style={{ width: '100%', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px', marginLeft: '797px' }}>
                <p style={{ width: '50%', marginTop: '20px', height: '10%', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', gap: '12px' }}>  Slide {tabx} of {numberOfTabsx}</p>
                <button style={buttx} onClick={() => { handleDeleteEntireAttendant(currentAttendantID) }}><img src={Delete} style={arrows} /></button>
                <button style={buttx} onClick={handlePrevx}><img src={Left} style={arrows} /></button>
                <button style={buttx} onClick={handleNextx}><img src={Right} style={arrows} /></button>
              </div>
            </div>
          </Modal>

          {/* <Modal isOpen={visible} onRequestClose={() => setVisible(false)} style={modalUpdate}>
                  <h1>Update</h1>
                  <input type='text' placeholder='Username' name="username" onChange={handleChange} />
                  <input type='text' placeholder='Password' name="password" onChange={handleChange} />
                  <input type='text' placeholder='Address eg: Kigali - Kicukiro' name="address" onChange={handleChange} />
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
                  <input type='email' placeholder='Work-related Email' name='email' onChange={handleChange} />

                  <div style={{ color: 'black', display: 'flex', flexDirection: 'inline', gap: '9px', justifyContent: 'center' }}>
                    <p>Attach New Picture ID (Not required)</p>
                    <label htmlFor="file" id="customButton" style={{ width: '35%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', borderRadius: '23px', gap: '9px', cursor: 'pointer' }}>
                      <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                      {file || 'No file chosen'} <img style={{ width: '12%', display: 'inline' }} src={ImgAdd} alt="Add" />
                    </label>
                  </div>
                  <button onClick={() => handleUpdate(emp.id)}>Submit</button>
                </Modal> */}



          <Modal isOpen={createModal} onRequestClose={closeCreateModal} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
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

export default Onboard;
