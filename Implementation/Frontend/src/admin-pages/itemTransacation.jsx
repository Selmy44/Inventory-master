import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import NavbarAdmin from './navbarAdmin';
import '../style.css';
import axios from 'axios';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { CSVLink } from 'react-csv'
import Keys from '../keys';
import Print from '../images/print.svg'
import Download from '../images/download.svg'
import Export from '../images/export.svg';



function ItemTransactionsAdmins() {

  const [report, setReport] = useState([]);
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const kindaStyle = {
    width: '70%',
    marginLeft: '263px',
    marginBottom: '1px',
    // overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    overflowY: 'hidden',
    justifyContent: 'center',
    flexDirection: 'column',
  };

  const svgStyle = {
    width: '33px',
    height: '30px',
    borderRadius: '14px',
  }

  const url = Keys.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        console.log('Dates: ', startDate, endDate)
        const response = await axios.get(`${url}/monthly-report/${startDate}/${endDate}`);
        setReport(response.data);
        setRecords(response.data);
      } catch (error) {
        // console.error('Error fetching Data', error);
      }
    };

    fetchMonthlyReport();
  }, [startDate, endDate]);

  useEffect(() => {
    setRecords(report);
  }, [report]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
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
  ];

  const handleFilter = (event) => {
    const newData = report.filter((row) => {
      return row.item_name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  };

  let printContent = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
      * {
          margin: 0%;
      }

      body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 800px;
          padding: 20px;
          /* display: flex;
          flex-direction: inline; */
      }

      .title {
          text-align: center;
      }

      .letterhead {
          /* margin-bottom: 20px; */
          /* padding-bottom: 10px; */
          display: flex;
          width: 100%;
          height: 23%;
          gap: 303px;
          /* justify-content: flex-end; */
          /* padding: 20px; */
      }

      .report {
          margin-top: 32px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
      }


      .contact-info {
          font-size: 0.9rem;
          margin-bottom: 10px;
      }

      .delivery-note {
          text-decoration: underline;
          font-weight: bold;
          margin-bottom: 10px;
      }

      table {
          width: 100%;

          border-collapse: collapse;
          border-radius: 12px;
          border: 1px solid #ccc;
          overflow: hidden;
      }

      th,
      td {
          border: 1px solid #000;
          padding: 4px;
          text-align: center;
          border-collapse: collapse;

      }
  </style>
</head>

<body>
  <div class="all">
      <div class="letterhead">
          <div style="width: 40%; height: 40%; ">
              <img src="https://firebasestorage.googleapis.com/v0/b/inventoryquotation.appspot.com/o/Centrikalogo%2Fcentrika-removebg.png?alt=media&token=cfce643f-ba97-4fc8-8a05-8571d0a9ce79"
                  alt="centrika-removebg" style="width: 200px; height: 130px;" />
          </div>


          <div style="margin-right: 30px; display: flex; ">
              <div class="address">
                  <p>P.O. Box: 4097 Kigali-Rwanda</p>
                  <p>KN 2, Nyarugenge Kigali-Rwanda</p>
                  <p>Tel: +250 731 000 100</p>
                  <p>Email: info@centrika.rw</p>
                  <p>Website: <a href="http://www.centrika.rw">www.centrika.rw</a></p>
              </div>
          </div>
      </div>

      <div class="report">
          <h1>Inventory Report</h1>
          <table border="1" cellspacing="0" cellpadding="5">
              <thead>
                  <tr>
                  <th>Date</th>
                      <th>Item</th>
                      <th>Number In Stock</th>
                      <th>Number Out</th>
                      <th>Requestor</th>
                      <th>Balance</th>
                  </tr>
              </thead>
              <tbody>

               ${records.map(record => `
               <tr>
               <td>${record.transaction_date}</td>
               <td>${record.item_name}</td>
               <td>${record.amount_entered}</td>
               <td>${record.amount_went_out}</td>
               <td>${record.taker_name}</td>
               <td>${record.total_items_in}</td>
               </tr>
               `).join('')}
              </tbody>
          </table>
      </div>
</body>
</html>`;

  const handlePrint = () => {

    const printWindow = window.open('', '', 'width=900,height=650, display=flex, justifyContent=center')
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    // const pd = document.getElementById(`${printContent}`);

  }

  const kain = {
    marginLeft: '109px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(163, 187, 197)',
    paddingTop: '70px',
    overflow: 'auto',
    // width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black',
  };

  const fileName = `Transaction Report From ${startDate} to ${endDate}`;

  return (
    <div>
      <NavbarAdmin />
      <div style={kain}>
        <h1 style={{ marginLeft: '75px' }}> Item Report Tab</h1>
      </div>

      <div className="transaction-container-admin">
        <div style={kindaStyle}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '9px', alignItems: 'center', height: '9%' }}>
            <input style={{ height: '100%' }} type="text" placeholder="Search By Item Name" onChange={handleFilter} />
          </div>
          <br />
          <div style={{ width: '100%', display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: 'inline' }}>
            <p style={{ marginTop: '5px' }}>From:</p> <input type="date" onChange={(e) => setStartDate(e.target.value)} style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} />
            <p style={{ marginTop: '5px' }}>To:</p> <input type="date" onChange={(e) => setEndDate(e.target.value)} style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} />
          </div>
          <br />
          <div style={{ display: 'flex', height: '30%', gap: '9px', flexDirection: 'inline', alignItems: 'center' }}>
            <button className='buttonStyle2' onClick={handlePrint}><img src={Print} style={svgStyle} /></button>
            <button className='buttonStyle2' onClick={handleDownload}><img src={Export} style={svgStyle} /></button>
            <CSVLink data={records} filename={fileName}> <button className='buttonStyle2'><img src={Download} style={svgStyle} /></button></CSVLink>
          </div>
          <br />
          <div style={{ height: '100%', width: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '9px' }}>

            <DataTable columns={columns} data={records} pagination />
          </div>

          <br />
        </div>
      </div>
    </div>
  );
};

export default ItemTransactionsAdmins;
