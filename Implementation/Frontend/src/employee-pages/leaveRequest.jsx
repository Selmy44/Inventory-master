import Navbar from './navbar';
import React, { useEffect, useState } from 'react';
import Annual_Leave from '../images/annual_leave.jpg';
import Maternity_leave from '../images/maternity_leave.jpg';
import Sick_Leave from '../images/sick_leave.jpg';
import Incidental_leave from '../images/incidental_leave.jpg';
import Tick from '../images/tick.svg'
import Modal from 'react-modal';
import Waves from '../images/waves.svg'
import Motherhood from '../images/motherhood.svg'
import io from 'socket.io-client';
import Sick from '../images/sick.svg'
import Select from 'react-select';
import Cross from '../images/cross.svg';
import Keys from '../keys';
import axios from 'axios';
import Left from '../images/left-arrow.svg';
import Right from '../images/right-arrow.svg';
import '../style.css';
import DataTable from 'react-data-table-component';


function LeaveRequest() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;
    const socket = io.connect(`${ioPort}`);

    const [isAnnualLeaveOpen, setIsAnnualLeaveOpen] = useState(false);
    const [applicationSent, setApplicationSent] = useState(false);
    const [isMaternityLeaveOpen, setIsMaternityLeaveOpen] = useState(false);
    const [isSickLeaveModalOpen, setIsSetLeaveModalOpen] = useState(false);
    const [isIncidentalLeaveModal, setIsIncidentalModalOpen] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [supervisorId, setSupervisorId] = useState([]);
    const [leaveBF, setLeaveBF] = useState(0);
    const [leaveAvailable, setLeaveAvailable] = useState('');
    const [leaveBeforeThisApplication, setLeaveBeforeThisApplication] = useState('');
    const [leaveTakenThisYear, setLeaveTakenThisYear] = useState('')
    const [lastDifference, setLastDifference] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [animationClass, setAnimationClass] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [workingDays, setWorkingDays] = useState(0);
    const [tab, setTab] = useState(1);
    const [DOE, setDOE] = useState({});
    const [leavetype, setLeavetype] = useState(Number)
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const leaveDiv = {
        width: '80%',
        height: '40%',
        backgroundColor: 'rgb(190, 226, 243)',
        marginTop: '10px',
        marginLeft: '230px',
        borderRadius: '15px'
    };

    const modalAlert = {
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

    const holder = {
        width: '100%',
        height: '85%',
        borderRadius: '12px',
        display: 'flex',
        // backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '400px'
    };

    const ButtonImages = {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'inline',
        flexWrap: 'wrap',
        gap: '9px',
        marginTop: '45px',
        backgroundColor: 'rgb(190, 226, 243)'
    }

    const buttx = {
        width: '10%',
        height: '60px',
        display: 'flex',
        borderRadius: '30px',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const arrows = {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',

        },
        content: {
            width: '53%',
            marginLeft: '295px',
            height: '81vh',
            backgroundColor: 'rgb(206, 206, 236)',
            border: 'none',
            borderRadius: '12px',
            gap: '23px',
            flexDirection: 'column',
            color: "black",
            padding: '12px 0px',
            fontFamily: 'Arial, sans- serif',
            display: 'flex',
        },
    };

    const openIncidentalModal = () => {
        setIsIncidentalModalOpen(true);
    }

    const closeIncidentalLeaveModal = () => {
        setIsIncidentalModalOpen(false);
        setLeaveStartDate('');
        setSelectedSupervisor('');
        setWorkingDays(0);
        setLeaveEndDate('');
    };

    const openSickLeaveModal = () => {
        setIsSetLeaveModalOpen(true);
    }

    const closeSickLeaveModal = () => {
        setIsSetLeaveModalOpen(false);
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    }

    const openMaternityLeaveModal = () => {
        setIsMaternityLeaveOpen(true);
    }

    const closeMaternityLeaveModal = () => {
        setIsMaternityLeaveOpen(false);
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    };

    const openAnnualLeaveModal = () => {
        setLeavetype(0);
        setIsAnnualLeaveOpen(true);
    }

    const closeAnnualLeaveModal = () => {
        setIsAnnualLeaveOpen(false);
        setLeavetype('')
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    }

    const handleStartDate = (event) => {
        setLeaveStartDate(event.target.value);
    };

    const handleEndDate = (event) => {
        const selectedEndDate = new Date(event.target.value)
        setLeaveEndDate(selectedEndDate);
    };

    const supervisor = supervisorId.map((supervisor) => ({
        value: supervisor.id,
        label: supervisor.username
    }));

    const customStyle = {
        control: (provided) => ({
            ...provided,
            width: 190,
            color: 'black',
            border: 'none',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center'
        }),
        option: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            '&:hover': {
                backgroundColor: 'black',
                color: 'white'
            }

        }),
        singleValue: (provided) => ({
            ...provided,
            width: '100%',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            color: 'black',
        })
    };

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

    const holidays = [
        {
            name: 'New Years Day',
            date: '1/1/0000'
        }, {
            name: 'National Heroes Day',
            date: '1/2/0000'
        }, {
            name: 'Good Friday',
            date: '29/3/0000'
        }, {
            name: 'Easter Monday',
            date: '1/4/0000'
        }, {
            name: 'Genocide Memorial Day',
            date: '7/4/0000'
        }, {
            name: 'Eid-al-Fitr',
            date: '10/4/0000'
        }, {
            name: 'Labour Day',
            date: '1/5/0000'
        }, {
            name: 'Eid al-Adha',
            date: '17/6/0000'
        }, {
            name: 'Independence Day',
            date: '1/7/0000'
        }, {
            name: 'Umuganura Day',
            date: '2/8/0000'
        }, {
            name: 'Assumption Day',
            date: '15/8/0000'
        }, {
            name: 'Christmas Day',
            date: '25/12/0000'
        }, {
            name: 'Boxing Day',
            date: '26/12/0000'
        },
    ];

    const getWorkingDaysBetweenDates = (startDate, endDate, holiday) => {

        // console.log("Received startDate: ", startDate, "endDate: ", endDate); // Debugging

        // Ensure both are Date objects
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            // console.error("startDate or endDate is not a valid Date object");
            return;
        }


        let workingDaysCount = 0;

        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        for (let year = startYear; year <= endYear; year++) {
            const startMonth = (year === startYear) ? startDate.getMonth() : 0;
            const endMonth = (year === endYear) ? endDate.getMonth() : 11;

            for (let month = startMonth; month <= endMonth; month++) {
                const workingDaysInMonth = getWorkingDaysInMonth(year, month, holiday);

                workingDaysInMonth.forEach(date => {
                    if (date >= startDate && date <= endDate) {
                        workingDaysCount++;
                    }
                });
            }
            if (leaveStartDate, leaveEndDate, holidays) {
                getWorkingDaysBetweenDates(leaveStartDate, leaveEndDate, holidays)
            }
        }
        return workingDaysCount;
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const isHoliday = (date) => {
        return formattedHolidays.some(holiday =>
            holiday.date.getDate() === date.getDate() &&
            holiday.date.getMonth() === date.getMonth()
        );
    };

    const currentYear = new Date().getFullYear();

    const formattedHolidays = holidays.map(holiday => {
        const [day, month] = holiday.date.split('/');
        const date = new Date(currentYear, month - 1, day);
        return { ...holiday, date };
    });


    const getWorkingDaysInMonth = (year, month) => {

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const workingDays = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

            if (!isWeekend(date) && !isHoliday(date)) {
                workingDays.push(date);
            }
        }

        return workingDays;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [notEarnedAlert, setNotEarnedAlert] = useState(false);


    useEffect(() => {
        if (leaveStartDate && leaveEndDate) {
            console.log("leaveStartDate: ", leaveStartDate, "leaveEndDate: ", leaveEndDate); // Debugging

            // Convert to Date objects
            const startDate = new Date(leaveStartDate);
            const endDate = new Date(leaveEndDate);

            // Log the converted Date objects
            console.log("Converted startDate: ", startDate, "endDate: ", endDate);

            // Check if the conversion was successful
            if (!isNaN(startDate) && !isNaN(endDate)) {
                const result = getWorkingDaysBetweenDates(startDate, endDate, holidays);
                setWorkingDays(result);
                console.log("Result: ", result);
            } else {
                console.error("Invalid date format or unable to parse date");
            }
        }
    }, [leaveStartDate, leaveEndDate, holidays]);

    const applyAnnualLeave = () => {

        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Annual Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        if (lastDifference >= workingDays) {
            setApplicationSent(true);

            socket.emit("Employee_Leave_Message_Supervisor(1)", message);
            setInterval(() => {
                setApplicationSent(false);
            }, 2700)

        } else {
            // window.alert(`You haven't Earned ${workingDays}.`)

            setNotEarnedAlert(true);

            setInterval(() => {
                setNotEarnedAlert(false);
            }, 2700);
        }
    };

    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    }



    const applyMaternityLeave = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Maternity Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const applySickLeave = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Sick Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const applyIncidental = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Incidental Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const numberOfTabs = 3

    const handlePrev = () => {
        setAnimationClass('slide-left');
        setTab((prev) => (prev > 1 ? prev - 1 : numberOfTabs));
    };

    const handleNext = () => {
        setAnimationClass('slide-right');
        setTab((prev) => (prev < numberOfTabs ? prev + 1 : 1));
    };

    const resetAnimation = () => {
        setAnimationClass('');
    };

    const oneEmployeeID = localStorage.getItem('userID');

    useEffect(() => {
        const func = async (oneEmployeeID) => {

            try {
                const response = await axios.get(`${url}/get-DOE/${oneEmployeeID}`);
                const get = {
                    month: new Date(response.data.date_of_employment).getMonth() + Number(1),
                    year: new Date(response.data.date_of_employment).getFullYear(),
                }
                console.log("Data about employee: ", get);
                setDOE(get);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        func(oneEmployeeID);
    }, [oneEmployeeID]);

    console.log("Real DOE: ", DOE);

    useEffect(() => {
        const Dday = new Date().getDate()
        const Mmonth = new Date().getMonth() + 1;
        const Yyear = new Date().getFullYear();

        const today = `${Dday}/${Mmonth}/${Yyear}`;
        setCurrentDate(today);

        const differenceInMonth = async (DOEMonthx, DOEYearx) => {
            try {

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                if (DOEYear === currentYear) {
                    const lastMonth = currentMonth - Number(1);
                    // const diff = ((Number(lastMonth) - Number(DOEMonth)) * Number(1.5));
                    const diff = ((Number(lastMonth) - Number(DOEMonth)) * Number(1.5));
                    console.log(`Show us some Difference ${lastMonth} - ${DOEMonth} * ${1.5} = ${diff}`);
                    setLeaveAvailable(diff);
                    const zero = 0;
                    setLeaveBF(zero);
                } else if (DOEYear !== currentYear) {
                    const January = 1;
                    setLeaveAvailable((Number(currentMonth) - Number(January)) * Number(1.5));
                    const response = await axios.get(`${url}/get-leave-bf/${oneEmployeeID}/${DOEYear}/${currentYear}`);
                    const lastYear = currentYear - 1;
                    console.log("Last Year: ", lastYear);
                    const get = (Number(lastYear) - Number(DOEYear)) * Number(18);
                    console.log(`${lastYear} - ${DOEYear} * 18 = ${get}`);

                    if (lastYear === DOEYear) {
                        const actual = lastYear + Number(1);
                        const get = (Number(actual) - Number(DOEYear)) * Number(18);

                        console.log(`12 - ${DOEMonth} * 1.5 + 1.5 = ${Number(Number(12) - Number(DOEMonth)) * Number(1.5) + Number(1.5)}`)
                        const remove = Number(Number(12) - Number(DOEMonth)) * Number(1.5) + Number(1.5);
                        const leaveBF = get - response.data.total_leave_taken_past_years;
                        console.log(`${actual} - ${DOEYear} * 18 = ${get}`);
                        // setLeaveBF(leaveBF - Number(remove));
                        setLeaveBF(remove);

                    } else {
                        const remove = Number(Number(12) - Number(DOEMonth)) * Number(1.5);
                        const leaveBF = get - response.data.total_leave_taken_past_years + Number(remove);

                        console.log(`12 - ${DOEMonth} * 1.5 + ${leaveBF}`)
                        setLeaveBF(leaveBF);
                    }
                };
            } catch (error) {
                console.error("Error :", error);
            }
        };

        const DOEMonth = DOE.month;
        const DOEYear = DOE.year;

        differenceInMonth(DOEMonth, DOEYear)

    }, [DOE, oneEmployeeID, leaveAvailable]);

    useEffect(() => {
        if (leaveStartDate && leaveEndDate) {
            console.log("leaveStartDate: ", leaveStartDate, "leaveEndDate: ", leaveEndDate); // Debugging

            // Convert to Date objects
            const startDate = new Date(leaveStartDate);
            const endDate = new Date(leaveEndDate);

            // Log the converted Date objects
            console.log("Converted startDate: ", startDate, "endDate: ", endDate);

            // Check if the conversion was successful
            if (!isNaN(startDate) && !isNaN(endDate)) {
                const result = getWorkingDaysBetweenDates(startDate, endDate, holidays);
                setWorkingDays(result);
                console.log("Result: ", result);
            } else {
                console.error("Invalid date format or unable to parse date");
            }
        }
    }, [leaveStartDate, leaveEndDate, holidays]);

    useEffect(() => {
        const func = async (oneEmployeeID) => {
            try {
                const currentYear = new Date().getFullYear();

                const response = await axios.get(`${url}/get-leave-taken/${oneEmployeeID}/${currentYear}`);
                setLeaveTakenThisYear(response.data.total_leave_taken_in_current_year);

            } catch (error) {
                console.error("Error: ", error)
            }
        };

        func(oneEmployeeID);
    }, [oneEmployeeID]);

    useEffect(() => {
        const func = (leaveBFI3, leaveAva3) => {
            try {
                const sum = (Number(leaveBF) + Number(leaveAvailable));
                setLeaveBeforeThisApplication(sum);

                setLastDifference(sum - Number(leaveTakenThisYear));

            } catch (error) {
                console.error("Error: ", error);
            }
        };
        func(leaveBF, leaveAvailable)
    }, [leaveBF, leaveAvailable, leaveTakenThisYear]);


    useEffect(() => {
        const func = async (oneEmployeeID) => {
            try {

                // if (leavetype === 0) {
                const response = await axios.get(`${url}/get-leave-notifications-employee/${oneEmployeeID}`);
                setLeaveHistory(response.data);
                // }
                console.log("Response: ", response.data);

            } catch (error) {
                console.error("Error", error);
            }
        }
        if (oneEmployeeID) {
            func(oneEmployeeID);
        };

    }, [oneEmployeeID]);



    const columns = [
        {
            name: 'Name',
            selector: row => row.username
        },
        {
            name: 'Days Taken',
            selector: row => row.daysRequired
        },
        {
            name: 'From',
            selector: row => formatDate(row.startDate)
        },
        {
            name: 'To',
            selector: row => formatDate(row.endDate)
        }

    ]

    return (
        <div>
            <Navbar></Navbar>
            <div className="leave-container">
                <div style={leaveDiv}>
                    <div style={ButtonImages}>
                        <button className='buttonP' onClick={() => openAnnualLeaveModal()}>  <img src={Annual_Leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openMaternityLeaveModal()}>  <img src={Maternity_leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openSickLeaveModal()}>  <img src={Sick_Leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openIncidentalModal()}>  <img src={Incidental_leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                    </div>
                </div>

                <Modal isOpen={isAnnualLeaveOpen} onRequestClose={closeAnnualLeaveModal} style={modal}>
                    <div
                        className={animationClass}
                        style={holder}
                        onAnimationEnd={resetAnimation} // Reset animation class after animation ends
                    >

                        {tab === 1 &&

                            <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className='leaveHeader'>
                                    <h1>Apply Annual Leave</h1>
                                </div>
                                <img src={Waves} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh' }} />

                                <div className='leaveLine'>
                                    <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                                    <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                                    <p>Days Applied: {workingDays} </p>
                                </div>
                                <br />
                                <div>
                                    <Select
                                        options={supervisor}
                                        styles={customStyle}
                                        placeholder="Select Supervisor"
                                        onChange={handleSupervisorChange}
                                    />
                                </div>
                                <br />
                                <div className='leaveFooter'>
                                    <button onClick={() => applyAnnualLeave()}>Apply</button>
                                </div>
                            </div>
                        }

                        {
                            tab === 2 && <div style={{ width: '100%', gap: '15px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <h1>Annual Leave Info</h1>
                                    <img src={Waves} style={{ maxWidth: '20%', objectFit: 'cover', maxHeight: '40vh' }} />
                                </div>

                                <div className='numbers'>
                                    <p>.</p>
                                </div>

                                <div className='numbers'>
                                    <p>.</p>
                                </div>

                                <div style={{ width: '100%', backgroundColor: 'green', display: 'flex', flexDirection: 'inline' }}>

                                    <div style={{ width: '50%', backgroundColor: 'white' }}>

                                        <div style={{ width: '60%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>
                                            <p>Leave B/F: {leaveBF} </p>
                                        </div>

                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Earned to date : {leaveAvailable} </p>

                                        </div>

                                        <br />

                                        <div style={{ width: '60%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Balance before this application: {leaveBeforeThisApplication} - {leaveTakenThisYear} = {Number(leaveBeforeThisApplication) - Number(leaveTakenThisYear)} </p>

                                        </div>

                                    </div>

                                    <div style={{ width: '50%', backgroundColor: 'white' }}>

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Annual Entitlement: 18 </p>

                                        </div>

                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Taken This Year: {leaveTakenThisYear} </p>

                                        </div>

                                        <br />

                                        <div style={{ width: '50%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave balance incl. This application: {(Number(lastDifference) - Number(workingDays))} </p>

                                        </div>

                                    </div>
                                </div>



                            </div>
                        }

                        {tab === 3 &&

                            <div style={{ width: '100%', gap: '2px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <h1>Annual Leave History</h1>
                                    <img src={Waves} style={{ maxWidth: '20%', objectFit: 'cover', maxHeight: '40vh' }} />
                                </div>

                                <div className='numbers'>
                                    <p>.</p>
                                </div>

                                <div className='numbers'>
                                    <p>.</p>
                                </div>
                                <div>
                                    <DataTable
                                        data={leaveHistory}
                                        columns={columns}

                                    ></DataTable>

                                </div>
                            </div>
                        }

                    </div>
                    <div style={{ width: '100%', height: '10%', display: 'flex', marginBottom: '9px', flexDirection: 'inline', gap: '12px' }}>
                        <div style={{ width: '100%', justifyContent: 'right', height: '20%', marginRight: '9px', display: 'flex', gap: '12px' }}>
                            <button style={buttx} onClick={handlePrev}><img src={Left} style={arrows} /></button>
                            <button style={buttx} onClick={handleNext}><img src={Right} style={arrows} /></button>
                        </div>

                    </div>

                </Modal>

                <Modal isOpen={isMaternityLeaveOpen} onRequestClose={closeMaternityLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='leaveHeader'>
                            <h1>Apply Maternity Leave</h1>
                        </div>
                        <img src={Motherhood} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', marginTop: '9px', marginBottom: '9px' }} />

                        <div className='leaveLine'>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div className='leaveFooter'>
                            <button onClick={() => applyMaternityLeave()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isSickLeaveModalOpen} onRequestClose={closeSickLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='leaveHeader'>
                            <h1>Apply Sick Leave</h1>
                        </div>
                        <img src={Sick} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', marginTop: '9px', marginBottom: '9px' }} />

                        <div className='leaveLine'>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div className='leaveFooter'>
                            <button onClick={() => applySickLeave()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isIncidentalLeaveModal} onRequestClose={closeIncidentalLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='leaveHeader'>
                            <h1>Apply Incidental Leave</h1>
                        </div>
                        <img src={Waves} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh' }} />

                        <div className='leaveLine'>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div className='leaveFooter'>
                            <button onClick={() => applyIncidental()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={notEarnedAlert} style={modalAlert} >
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={Cross} style={svgStyle} />
                            <p style={{ color: 'white' }}>You haven't Earned {workingDays}.</p>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={applicationSent} style={modalAlert} >
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-484px', height: '6vh', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={Tick} style={svgStyle} />
                            <p style={{ color: 'white' }}>Application Sent.</p>
                        </div>
                    </div>
                </Modal>


            </div>
        </div>
    );
}

export default LeaveRequest;
