import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Centrika from '../images/centrika-removebg.png';


function Home2() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    const [transactionType, setTransactionType] = useState('');

    const handleTransactionChange = (event) => {
        const selectedTransactionType = event.target.value;
        setTransactionType(event.target.value);

        if (selectedTransactionType === "item") {
            navigate('/notification-supervisor')
        } else if (selectedTransactionType === "leave") {
            navigate('/supervisor-leave-notifications')
        } else {
            navigate('/purchase-supervisor')
        }
    };

    const select = {
        width: '209px',
        color: 'white',
        display: 'block',
        padding: '8px 16px',
        borderRadius: '12px',
        color: 'white',
        marginTop: '5px',
        textDecoration: 'none',
        backgroundColor: 'black',
        float: 'right',
        justifyContent: 'center'
    }

    return (
        <div>
            <ul className='ul1-super-home'>
                <li style={{ float: 'left', marginTop: '-1px', marginLeft: '12px' }} className='li1'><img style={{ maxWidth: '100%', maxHeight: '80vh' }} src={Centrika} alt='Centrika' /></li>
                <li className='li1' onClick={handleLogout}><Link>Log Out</Link></li>
                <select onChange={handleTransactionChange} value={transactionType} style={select}>
                    <option value="" disabled >Requests</option>
                    <option value="item" >Item</option>
                    <option value="purchase" >Purchase</option>
                    <option value="leave">Leave</option>
                </select>
                <li className='li1'><Link to={'/home-supervisor'}>Home</Link></li>
            </ul>
        </div>
    );
}

export default Home2;