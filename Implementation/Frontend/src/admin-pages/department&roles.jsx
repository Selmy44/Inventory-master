import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal'
import NavbarAdmin from './navbarAdmin';
import Addy from '../images/addItem.svg'
import Info from '../images/info.svg'
import Tick from '../images/approve.png'
import axios from 'axios';
import Keys from '../keys';

function Departments_Roles() {

    const url = Keys.REACT_APP_BACKEND;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDepartmentViewOpen, setIsDepartmentViewOpen] = useState(false);
    const [gotDepartment, setGotDepartment] = useState([]);
    const [takenDeptID, setTakenDeptID] = useState('');
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [isRoleViewModalOpen, setIsRoleViewModalOpen] = useState(false);
    const [viewRole, setViewRole] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState('');
    const [roleAddedWell, setRoleAddedWell] = useState(false);


    const [department, setDepartment] = useState({
        department_name: '',
        status: '',
    });

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            zIndex: '20',
            // alignItems: 'center',
            // opacity: 0, // Ensures overlay is present but transparent
            background: 'transparent',
        },
        content: {
            zIndex: '20',
            width: '25%',
            marginLeft: '495px',
            border: 'none',
            height: '100%',
            borderRadius: '12px',
            background: 'transparent',
            gap: '23px',
            marginTop: '-19px',
            padding: '12px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // alignItems: 'center',
        },
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
            left: '50%',
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

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };
    const openDepartmentView = () => {
        setIsDepartmentViewOpen(true);
    }

    const closeAddedWellModal = () => {

    }

    const openRoleViewModal = (row) => {
        handleViewRole(row);
        setIsRoleViewModalOpen(true);
    }

    const openAddRoleModal = (row) => {
        // handleAddRole(row)
        setTakenDeptID(row.id);
        setIsAddRoleModalOpen(true)
    }

    const closeDepartmentView = () => {
        setIsDepartmentViewOpen(false);
    }

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    }

    const closeRoleViewModal = () => {
        setIsRoleViewModalOpen(false)
    }


    const closeAddRoleModal = () => {
        setIsAddRoleModalOpen(false)
    }

    const AddButton = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '17%',
        color: 'white',
        backgroundColor: 'rgb(67, 67, 179)'

    }

    const handleInput = (event) => {
        setDepartment((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleViewRole = async (row) => {
        try {
            const response = await axios.get(`${url}/get-role/${row.id}`);
            console.log("Rolees", response);
            const result = await response.data;
            setViewRole(result)
        } catch (error) {
            console.error("Error", error);
        }
    }

    const addDepartment = async () => {
        try {
            const response = await axios.post(`${url}/add-department`, department);
            closeAddModal();

        } catch (error) {
            console.error("Error", error);
        }
    }

    const handleAddRole = async (takenDeptID) => {
        try {
            const all = {
                roleName: roleName,
                status: status
            }
            const response = await axios.post(`${url}/add-role/${takenDeptID}`, all);
            console.log("response", response);
            // window.alert("Role Added Well");
            setRoleAddedWell(true);
            closeAddRoleModal();

            setInterval(() => {
                setRoleAddedWell(false);
            }, 2700);

        } catch (error) {
            console.error("Error", error)
        }
    }

    useEffect(() => {

        const fetchDept = async () => {

            try {
                console.log("Dept", gotDepartment);
                const response = await axios.get(`${url}/get-department`);
                setGotDepartment(response.data);
            } catch (error) {
                console.error("Error", error);
            }
        }

        fetchDept();
    }, [gotDepartment]);

    const columns = [
        {
            name: 'Department',
            selector: row => row.department_name
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Add Role',
            cell: row => (
                <button className='addItem-btn' onClick={() => openAddRoleModal(row)}><img src={Addy} style={svgStyle} /></button>
            )
        },
        {
            name: 'View Role',
            cell: row => (
                <button className='addItem-btn' onClick={() => openRoleViewModal(row)}><img src={Info} style={svgStyle} /></button>
            )
        },
    ];

    const Roles = [
        {
            name: 'Role Name',
            selector: row => row.role_name
        },
        {
            name: 'Status',
            selector: row => row.status
        }
    ];

    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black'
    }

    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div style={kain}>
                <h1>Add A New Department & Role</h1>
            </div>
            <div className="dept-container-admin" >
                <button style={AddButton} onClick={openAddModal}>Add Department</button>
                <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} style={modalStyles}>
                    <h1>Create A Department</h1>
                    <input placeholder='Department Name' type='text' name='department_name' onChange={handleInput} />
                    <br />
                    <input placeholder='Status' type='text' name='status' onChange={handleInput} />
                    <br />
                    <button onClick={addDepartment}>Add</button>
                </Modal>
                <br />
                <button style={AddButton} onClick={openDepartmentView}>View Departments</button>
                <Modal isOpen={isDepartmentViewOpen} onRequestClose={closeDepartmentView} style={modalStyles}>

                    <DataTable
                        columns={columns}
                        data={gotDepartment}
                    ></DataTable>

                </Modal>

                <Modal isOpen={isAddRoleModalOpen} onRequestClose={closeAddRoleModal} style={modalStyles}>
                    <h1>Add A Role</h1>
                    <input type='text' name='role_name' placeholder='Role Name' onChange={(e) => setRoleName(e.target.value)} />
                    <br />
                    <input type='text' name='status' placeholder='Status' onChange={(e) => setStatus(e.target.value)} />
                    <br />
                    <button onClick={() => handleAddRole(takenDeptID)}>Submit</button>
                </Modal>
                <Modal isOpen={isRoleViewModalOpen} onRequestClose={closeRoleViewModal} style={modalStyles}>
                    <div style={{ width: '70%', height: 'auto', display: 'flex', alignItems: 'center', gap: '12px', flexDirection: 'column' }}>
                        <DataTable
                            columns={Roles}
                            data={viewRole}
                            pagination
                        >
                        </DataTable>
                    </div>
                </Modal>


                <Modal isOpen={roleAddedWell} onRequestClose={closeAddedWellModal} style={modal} >
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', zIndex: '20', border: 'none', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={Tick} style={svgStyle} />
                            <p style={{ color: 'white' }}>Role Added Well.</p>
                        </div>
                    </div>
                </Modal>


            </div>
        </div>
    );
}

export default Departments_Roles;
