import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import NavbarAdmin from './navbarAdmin';
import axios from 'axios'
import Add from '../images/add.svg'
import Delete from '../images/delete.svg'
import Modal from 'react-modal'
import HashLoader from "react-spinners/HashLoader";
import Keys from '../keys';

function CategoryAdmin() {

const url = Keys.REACT_APP_BACKEND;


  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '9px',
    marginTop: '2px',
    backgroundColor: 'rgb(206, 206, 236)'
  }

  const kindaStyle = {
    content: {
      width: '30%',
      height: '13%',
      display: 'flex',
      color: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      fontFamily: 'Arial, sans- serif',
      gap: '12px',
      borderRadius: '12px',
      backgroundColor: 'white',
      marginLeft: '480px',
      marginTop: '320px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      zIndex: '20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const modal = {
    overlay: {
      zIndex: '20',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '33%',
      marginLeft: '495px',
      height: '47vh',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      marginTop: '53px',
      color: "black",
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
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

  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [handleConfirmID, setHandleConfirmID] = useState();
  const [handleConfirmName, setHandleConfirmName] = useState();

  const [category, setCategory] = useState({
    category_name: '',
    description: ''
  });

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };


  const openDeletingWarning = (categoryId, category_name) => {
    setHandleConfirmID(categoryId);
    setHandleConfirmName(category_name)
    setIsConfirmModalOpen(true);
  };

  const closeDeletingItem = () => {
    setIsDeletingOpen(false);
  };

  const handleMake = async (event) => {
    try {
      await axios.post(`${url}/category`, category);
      console.log("Category added successfully")
      setAddVisible(false);
      window.location.reload();
    } catch {
      console.log('Error')
    };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange2 = (event) => {
    setCategory((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const HandleConfirmModal = (ID) => {
    setIsDeletingOpen(true);
    HandleConfirm(ID);
  }

  const HandleConfirm = async (id) => {
    try {
      const response = await axios.delete(`${url}/delete-category/${id}`);
      closeConfirmModal();
      setInterval(() => {
        closeDeletingItem(false);
      }, 2700);

    } catch (error) {
      console.error('Error fetching items: ', error);
    };
  };

  const handleFilter = (event) => {
    const newData = categories.filter((row) => {
      return row.category_name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredCategories(newData);
  };

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);


  return (
    <div>

      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>Category Tab</h1>
      </div>
      <div className="category-container">
        <div>
          <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /> <p style={{ color: 'white' }}>Add Category</p></button>
        </div>
        <br />

        <Modal isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
          <h1>Add Category</h1>
          <input type='text' placeholder='Category Name' name='category_name' onChange={handleChange2} />
          <input type='text' placeholder='Description' name='description' onChange={handleChange2} />
          <button onClick={handleMake}>Submit</button>
        </Modal>

        <div style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: 'rgb(185, 185, 234)', marginLeft: '14%', gap: '12px', width: '60%', height: '65%', padding: ' 8px', borderRadius: '15px', overflow: 'auto' }}>
          <div style={{ backgroundColor: 'rgb(185, 185, 234)', height: '12%', width: '100%', display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
            <input type='text' placeholder='Search...' onChange={handleFilter} />
          </div>

          {filteredCategories.map((category) => (
            <div key={category.id} className="category">
              <h2>{category.category_name}</h2>
              <br />
              <div style={{ display: 'flex', flexDirection: 'inline', gap: '9px' }}>
                <p>{category.description}</p>
                <button className='addItem-btn' onClick={() => openDeletingWarning(category.id, category.category_name)}><img src={Delete} style={svgStyle} /></button>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isConfirmModalOpen} onRequestClose={closeConfirmModal} style={kindaStyle}>
          <span>Are You Sure You Want To Delete {handleConfirmName} ?</span>
          <br />
          <button onClick={() => HandleConfirmModal(handleConfirmID)}>Yes</button>
        </Modal>

        <Modal isOpen={isDeletingOpen} onRequestClose={closeDeletingItem} style={modal}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
            <HashLoader color={'red'} loading={loading} size={59} />
            <div>
              <br />
              <p>Deleting {handleConfirmName} & It's Items...</p>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default CategoryAdmin;
