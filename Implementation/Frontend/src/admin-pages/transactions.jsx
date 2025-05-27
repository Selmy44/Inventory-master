import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import Modal from 'react-modal'


function TransactionsAdmin() {

  const [report, setReport] = useState([]);
  const [records, setRecords] = useState(report);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [action, setAction] = useState([]);
  const [isActionTransactionOpen, setIsActionTransactionOpen] = useState(false);

  const openItemTransaction = () => {
    setIsItemModalOpen(true);
  }

  const closeItemModal = () => {
    setIsItemModalOpen(false)
  };

  const openActionTransaction = () => {
    setIsActionTransactionOpen(true);
  }

  const closeActionTransaction = () => {
    setIsActionTransactionOpen(false);
  }

  const buttonStyle = {
    color: 'white',
    width: '109%',
    height: '23px',
    padding: '5px 12px',
    borderRadius: '45px',
    backgroundColor: 'black',
  };

  const modalStyles = {
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

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const response = await axios.get('http://localhost:5500/monthly-report');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching Data', error);
      }
    };

    fetchMonthlyReport();
  }, [])

  const columns = [
    {
      name: 'Date',
      selector: row => row.month
    },
    {
      name: 'Item',
      selector: row => row.item_name
    },
    {
      name: 'Item Entered',
      selector: row => row.amount_entered
    }, {
      name: 'Went Out',
      selector: row => row.amount_went_out
    }, {
      name: 'Taker',
      selector: row => row.taker_name
    },
    {
      name: 'Current Balance',
      selector: row => row.total_items_in
    },
  ]

  const handleFilter = (event) => {
    const newData = report.filter(row => {
      return row.item_name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setRecords(newData)
  }

  useEffect(() => {
    setRecords(report);
  }, [report]);

  const handlePrint = () => {
    window.print();
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
  }

  const Buttons = {
    width: "470px",
    display: "flex",
    gap: '12px'
  }

  useEffect(() => {

    const Func = async () => {
      try {

        const response = await axios.get("http://localhost:5500/get-action-transaction");
        setAction(response.data)

      } catch (error) {
        console.error("Error", error)
      }
    }

    Func()
  }, [])

  const colum = [
    {
      name: 'Employee Name',
      selector: row => row.employee_username
    },
    {
      name: 'Action',
      selector: row => row.action,
      style: row => ({
        color: row.action === 'Deleted' ? 'red' : row.action === 'Updated' ? 'blue' : 'black'
      })
    },
    {
      name: 'Item',
      selector: row => row.item_name
    }
  ]

  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>Transactions Tab</h1>
      </div>
      <div className="transaction-container-admin">
        <div>
          <div style={Buttons}>
            <button className='buttonStyle' onClick={openItemTransaction}>Open Item Transactions</button>
            {/* <br /> */}
            <button className='buttonStyle' onClick={openActionTransaction}>Action Transaction</button>
          </div>
          <Modal style={modalStyles} isOpen={isItemModalOpen} onRequestClose={closeItemModal}>
            <input type='text' placeholder='Search By Item Name' onChange={handleFilter} />
            <br />
            <button onClick={handlePrint}>Print</button>
            <DataTable
              columns={columns}
              data={records}
              pagination
            ></DataTable>
          </Modal>
          <Modal style={modalStyles} isOpen={isActionTransactionOpen} onRequestClose={closeActionTransaction}>
            <DataTable
              columns={colum}
              data={action}
              pagination
            ></DataTable>
          </Modal>
        </div>
      </div>
    </div>
  );
}


export default TransactionsAdmin;
