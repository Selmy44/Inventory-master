import React, { useState } from 'react';
import User from '../images/user.svg';
import Request from '../images/request-white.svg';
import Category from '../images/category-white.svg';
import Employees from '../images/employees-white.svg';
import Items from '../images/items-white.svg';
import NavbarAdmin from './navbarAdmin';
import Supplier from '../images/supplier-white.svg';
import Transaction from '../images/transaction-white.svg';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Keys from '../keys';

function Home() {

    const url = Keys.REACT_APP_BACKEND;

    const [name, setName] = useState('');
    const [categoryCount, setCategoryCount] = useState(null);
    const [itemCount, setItemCount] = useState(null);
    const [requestNumber, setRequestNumber] = useState(null);
    const [employeeCount, setEmployeeCount] = useState(null);
    const [supplierCount, setSupplierCount] = useState(null);

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`${url}/home-employee`)
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);
                } else {
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        axios.get(`${url}/number-category`)
            .then(res => {
                setCategoryCount(res.data.categoryCount);

            })
            .catch(err => {
                console.error('Error fetching category count:', err);

            })
    }, [])

    useEffect(() => {
        axios.get(`${url}/number-item`)
            .then(res => {
                setItemCount(res.data.itemCount);

            })
            .catch(err => {
                console.error('Error fetching category count:', err);

            })
    }, [])

    useEffect(() => {
        axios.get(`${url}/number-employee`)
            .then(res => {
                setEmployeeCount(res.data.employeeCount);

            })
            .catch(err => {
                console.error('Error fetching category count:', err);

            })
    }, []);

    useEffect(() => {
        axios.get(`${url}/get-number-of-requests`)
            .then(res => {
                setRequestNumber(res.data.requestCount);
            })
            .catch(err => {
                console.error('Error fetching Request count:', err);
            })
    }, [])

    useEffect(() => {
        axios.get(`${url}/number-supplier`)
            .then(res => {
                setSupplierCount(res.data.supplierCount);

            })
            .catch(err => {
                console.error('Error fetching category count:', err);

            })
    }, [])

    const Dash = {
        width: '100%',
        color: 'black',
        height: '1px',
        marginLeft: '235px',
        display: 'flex',
        marginTop: '55px'
    }
    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div className="icon-container-admin">
                <h1 style={Dash}>Dashboard</h1>
                <div className="icons-admin">
                    <img className='img1' src={User} alt='img1' />
                    <p>Account: {name}</p>
                </div>
                <div className="icons1-admin">
                    <img className='img1' src={Category} alt='img2' />
                    <p>Category: {categoryCount}</p>
                </div>
                <div className="icons2-admin">
                    <img className='img1' src={Items} alt='img3' />
                    <p> Items: {itemCount}</p>
                </div>
                <div className="icons3-admin">
                    <img className='img1' src={Employees} alt='img3' />
                    <p>Employees: {employeeCount}</p>
                </div>
                <div className="icons4-admin">
                    <img className='img1' src={Request} alt='img3' />
                    <p>Requests: {requestNumber}</p>
                </div>
                <div className="icons5-admin">
                    <img className='img1' src={Transaction} alt='img3' />
                    <p>Transactions: ---</p>
                </div>
                <div className="icons6-admin">
                    <img className='img1' src={Supplier} alt='img3' />
                    <p>Suppliers: {supplierCount}</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
