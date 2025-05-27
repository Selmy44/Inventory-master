
import React, { useState, useEffect } from 'react';
import NavbarMain from './navbarMain';
import Keys from '../keys';
import Modal from 'react-modal';
import Caution from '../images/caution.svg'
import ClipLoader from "react-spinners/ClipLoader";
import Tick from '../images/tick.svg'
import Cross from '../images/cross.svg'
import axios from 'axios';
import ProfilePicture from '../images/centrika-removebg.png';
import { ref, getDownloadURL, getStorage, } from "firebase/storage";
import DataTable from 'react-data-table-component';
import '../style.css';


function LeavePage() {

    const url = Keys.REACT_APP_BACKEND;

    const Container = {
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',


        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // fontFamily: "'Arial', sans-serif",
        backgroundColor: ' rgb(163, 187, 197)',
    };

    const CompanyButton = {
        height: '48%',
        width: '48%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
        display: 'flex',
        gap: '12px',
        flexDirection: 'inline'
    };

    const leave = {
        gap: '15px',
        width: '75%',
        // height: '49%',
        border: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'left',
        padding: '12px 0px',
        marginLeft: '200px',
        // marginTop: '278px',
        paddingLeft: '12px',
        borderRadius: '12px',
        flexDirection: 'inline',
        color: 'rgb(29, 27, 27)',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(206, 206, 236)',
    };

    const LeaveModal = {
        content: {
            width: '70%', // Adjust as needed
            height: '78%', // Adjust as needed
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            gap: '12px',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '12px',
            backgroundColor: 'white',
            margin: 'auto', // Center the modal within the overlay
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly opaque background for the overlay
            display: 'flex',
            zIndex: '20',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '20',
        },
        content: {
            width: '53%',
            marginLeft: '295px',
            height: '81vh',
            backgroundColor: 'rgb(206, 206, 236)',
            border: 'none',
            borderRadius: '12px',
            gap: '23px',
            color: "black",
            padding: '12px 0px',
            fontFamily: 'Arial, sans- serif',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
        },
    };

    const buttons = {
        borderRadius: '62px',
        width: '76%',
        color: 'black',
        cursor: 'pointer',
        backgroundColor: 'rgb(163, 187, 197)'
    };

    const button = {
        borderRadius: '62px',
        width: '16%',
        color: 'black',
        cursor: 'pointer',
        borderRadius: '12px',
        backgroundColor: 'white'
    };
    const buttonx = {
        borderRadius: '62px',
        width: '16%',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '12px',
        backgroundColor: 'green'
    };
    const AllLeavesStyle = {
        width: '99%',
        // height: '97%',
        borderRadius: '35px',
        padding: '17px',
        // position: 'relative',
        // overflow: 'hidden',
        backgroundColor: 'rgb(163, 187, 197)'
    };

    const textiee = {
        width: '379px',
        border: 'none',
        resize: 'none',
        height: '160%',
        color: 'black',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        backgroundColor: 'rgb(163, 187, 197)',
    }


    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    }

    const modalSmall = {
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
            width: '35%',
            marginLeft: '395px',
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

    const leaves = {
        width: '90%',
        height: '50vh',
        borderRadius: '35px',
        // backgroundColor: 'red',
        position: 'relative',
        animation: 'slideIn 1s ease-out forwards',
        overflow: 'hidden',
    };

    const report = {
        width: '90%',
        // height: '50vh',
        padding: '10px',
        // marginTop: '22px',
        overflow: 'auto',
        marginLeft: '22px',
        borderRadius: '35px',
        backgroundColor: 'white',
        position: 'relative',
        animation: 'slideIn 1s ease-out forwards',
        overflow: 'hidden',
    }

    const smaller = {
        width: '20%',
        height: '15%',
        display: 'flex',
        flexDirection: 'inline',
        gap: '9px',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const [employees, setEmployees] = useState([]);
    const [employeeImages, setEmployeeImages] = useState({});
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [oneEmployee, setOneEmployee] = useState([]);
    const [workingDays, setWorkingDays] = useState(0);
    const [leaveBeforeThisApplication, setLeaveBeforeThisApplication] = useState('');
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [oneEmployeeID, setOneEmployeeID] = useState(0);
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [DOE, setDOE] = useState({});
    const [leaveAvailable, setLeaveAvailable] = useState('');
    const [leaveTakenThisYear, setLeaveTakenThisYear] = useState('')
    const [leaveBF, setLeaveBF] = useState(0);
    const [tab, setTab] = useState(0);
    const [lastDifference, setLastDifference] = useState('')
    const [loading, setLoading] = useState(true);
    const [IDF, setIDF] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [otherLeavesReport, setOtherLeavesReport] = useState([]);
    const [allLeaves, setAllLeaves] = useState(false);
    const [otherLeaves, setOtherLeaves] = useState(false);
    const [leavesTypes, setLeavesTypes] = useState([]);
    const [employeeName, setEmployeeName] = useState('');
    const [oneLeaveType, setOneLeaveType] = useState('');
    const [oneLeaveArray, setOneLeaveArray] = useState([]);
    const [description, setDescription] = useState('');
    const [createModal, setCreateModal] = useState(false);
    const [createAppliedLeaveModal, setCreateAppliedLeaveModal] = useState(false);


    const holidays = [
        {
            name: 'New Years Day',
            date: '1/1/0000'
        }, {
            name: 'Day After New Years Day',
            date: '2/1/0000'
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
    }

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

    const closeCreateModal = () => {
        setCreateModal(false);
    };

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

                        console.log(`2023: 12 - ${DOEMonth} * 1.5 = ${Number(Number(12) - Number(DOEMonth)) * Number(1.5)}`)
                        const remove = Number(Number(12) - Number(DOEMonth)) * Number(1.5);
                        console.log("Remove: ", remove);
                        const leaveBroughtForward = get - response.data.total_leave_taken_past_years;
                        if (DOEMonth === 1) {
                            console.log("DOE: ", DOE)
                            return setLeaveBF(18 - Number(response.data.total_leave_taken_past_years));
                        } else {
                            console.log(`2023: ${actual} - ${DOEYear} * 18 = ${get}`);
                            // setLeaveBF(leaveBF - Number(remove));
                            // console.log(`remove - days taken = ${remove} - ${response.data.total_leave_taken_past_years} = ${Number(remove) - Number(response.data.total_leave_taken_past_years)}`)
                            setLeaveBF(remove - response.data.total_leave_taken_past_years);
                        }

                    } else {
                        const remove = Number(Number(12) - Number(DOEMonth)) * Number(1.5);
                        console.log(`${DOEYear}: 12 - ${DOEMonth} = ${Number(Number(Number(12) - Number(DOEMonth) + Number(1))) * Number(1.5)}`)
                        const getThis = Number(Number(Number(12) - Number(DOEMonth) + Number(1))) * Number(1.5);
                        const leaveBF = get - response.data.total_leave_taken_past_years + Number(remove);
                        console.log(`12 - ${DOEMonth} * 1.5 + ${leaveBF}`);
                        console.log(`${getThis} + ${get} = ${Number(getThis) + Number(get)}`);
                        // setLeaveBF(leaveBF);
                        setLeaveBF(Number(getThis) + Number(get) - response.data.total_leave_taken_past_years)
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

    const closeLeaveModal = () => {
        setLeaveAvailable('');
        setLeaveBF('');
        setWorkingDays(0);
        setIsLeaveModalOpen(false);
    };

    const handleStartDate = (event) => {
        setLeaveStartDate(event.target.value);
    };

    const handleEndDate = (event) => {
        const selectedEndDate = new Date(event.target.value)
        setLeaveEndDate(selectedEndDate);
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${url}/employees`);
                setEmployees(response.data);

                // Fetch images for each employee
                const storage = getStorage();
                const imageFetches = response.data.map(async (employee) => {
                    const imageRef = ref(storage, `employeesProfilePictures/${employee.id}`);
                    try {
                        const imageURL = await getDownloadURL(imageRef);
                        return { [employee.id]: imageURL };
                    } catch (error) {
                        // return { [employee.id]: console.log("No Image") };
                    }
                });

                const images = await Promise.all(imageFetches);
                const imagesMap = Object.assign({}, ...images);
                setEmployeeImages(imagesMap);
            } catch (error) {
                console.error("Error: ", error);
            }

        }
        fetchEmployees();
    }, []);


    const oneEmployeeFunction = async (ID) => {
        const response = await axios.get(`${url}/employee-once/${ID}`);
        setOneEmployee(response.data);
    };

    const formatDate = (dateString) => {

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [leaving, setLeaving] = useState(false);
    const [notLeaving, setNotLeaving] = useState(false);

    const applyLeaveI = async () => {
        try {

            const applyingYear = leaveEndDate.getFullYear();

            const data = {
                workingDays: workingDays + Number(1),
                empID: oneEmployeeID,
                applyingYear: applyingYear,
                from: leaveStartDate,
                to: leaveEndDate
            };

            if (lastDifference >= workingDays) {
                await axios.post(`${url}/take-needed-days`, data).then(
                    setInterval(() => {
                        closeAppliedLeaveLoader();
                        setCreateAppliedLeaveModal(false);

                    }, 2700),
                ).then(
                    // window.alert(`${oneEmployee[0].username} will be on leave fot ${workingDays} Days`)
                    setLeaving(true),
                    setInterval(() => {
                        setLeaving(false)
                    }, 3700)
                )
            } else {
                // window.alert(`${oneEmployee[0].username} hasn't earned ${workingDays} days.`);
                setInterval(() => {
                    closeAppliedLeaveLoader();
                    setCreateAppliedLeaveModal(false);

                }, 700);

                setNotLeaving(true);

                setInterval(() => {
                    setNotLeaving(false)
                }, 2700);
            }


        } catch (error) {
            console.error("Error", error)
        }
    };

    const applyLeave = () => {
        setCreateAppliedLeaveModal(true);
        applyLeaveI();
    }

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


    const openLeaveAllModal = async (ID) => {
        setAllLeaves(true)
        setOneEmployeeID(ID);
        setIDF(ID);
    };

    const openAnnualLeave = (ID) => {
        closeAllLeaveModal();
        setIsLeaveModalOpen(true);
        oneEmployeeFunction(ID);
    };

    const closeAllLeaveModal = () => {
        setAllLeaves(false);
    };

    const openOtherLeaveModal = (id) => {
        setOtherLeaves(true);
        setOneLeaveType(id);
    };

    const closeOtherLeavesModal = () => {
        setOtherLeaves(false);
        setDescription("");
    };


    const closeAppliedLeaveLoader = () => {
        setCreateAppliedLeaveModal(false);
    };

    useEffect(() => {
        const func = async () => {
            try {
                const response = await axios.get(`${url}/get-all-leaves`);
                setLeavesTypes(response.data);
            } catch (error) {
                console.error("Error", error);
            };
        }
        func();
    }, []);


    useEffect(() => {
        console.log("EmployeeID Passed: ", oneEmployeeID);
        const func = async (oneEmployeeID) => {
            try {
                const reponsee = await axios.get(`${url}/employee-name/${oneEmployeeID}`);
                setEmployeeName(reponsee.data.username);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        if (oneEmployeeID) {
            func(oneEmployeeID);
        };

    }, [oneEmployeeID]);

    useEffect(() => {
        const func = async (oneLeaveType) => {
            try {
                const response = await axios.get(`${url}/get-one-leave-type/${oneLeaveType}`);
                setOneLeaveArray(response.data);

            } catch (error) {
                console.error("Error: ", error);
            };
        }

        if (oneLeaveType) {
            func(oneLeaveType);
        }

    }, [oneLeaveType]);

    const applyOtherLeaves = async (leaveName) => {
        try {

            const data = {
                empID: oneEmployeeID,
                name: leaveName,
                description: description,
                days_needed: workingDays,
                leaveStartDate: leaveStartDate,
                leaveEndDate: leaveEndDate,
                currentYear: currentYear
            };

            const response = await axios.post(`${url}/post-other-leave`, data);
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const applyOtherLeave = (leaveName) => {
        setCreateModal(true);
        applyOtherLeaves(leaveName);
    }

    useEffect(() => {
        const func = async (oneEmployeeID) => {
            try {
                const response = await axios.get(`${url}/get-other-leaves/${oneEmployeeID}`);
                console.log("Response: ", response.data);
                setOtherLeavesReport(response.data);

                setInterval(() => {
                    closeCreateModal();
                }, 3700);

            } catch (error) {
                console.error("Error: ", error);
            };
        };
        func(oneEmployeeID);
    }, [oneEmployeeID]);

    const column = [
        {
            name: 'Name Of Leave',
            selector: row => row.name
        },
        {
            name: 'Description',
            selector: row => row.description
        },
        {
            name: 'Days ',
            selector: row => row.days_needed
        }, {
            name: 'Start Date',
            selector: row => formatDate(row.startDate)
        },
        {
            name: 'End Date ',
            selector: row => formatDate(row.endDate)
        },
        {
            name: 'Year',
            selector: row => row.year
        }
    ];


    return (
        <div>
            <NavbarMain></NavbarMain>
            <div style={kain}>
                <h1>Leave Tab</h1>
            </div>
            <div style={Container}>
                <div style={leave}>
                    {employees.map(employee => (
                        // <button key={employee.id} style={CompanyButton} onClick={() => openLeaveModal(employee.id)}>
                        <button key={employee.id} style={CompanyButton} onClick={() => openLeaveAllModal(employee.id)}>
                            {employeeImages[employee.id] ? (
                                <img
                                    src={employeeImages[employee.id]}
                                    alt={`${employee.username} logo`}
                                    style={{ width: '25%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            ) : (
                                <img
                                    src={ProfilePicture}
                                    alt="default profile"
                                    style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>Name: {employee.username}</p>
                                <p>Email: {employee.email}</p>
                                <p>Address: {employee.address}</p>
                                <p>Phone Number: {employee.phoneNumber}</p>
                                <p>Role: {employee.role_name}</p>
                                <p>{employee.number}</p>
                            </div>
                        </button>
                    ))}

                    <Modal isOpen={isLeaveModalOpen} onRequestClose={closeLeaveModal} style={modal}>
                        {oneEmployee.map(employee => (
                            <>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <h1>{employee.username}</h1>
                                </div>

                                <div style={{ width: '100%', height: '100%', backgroundColor: 'rgb(206, 206, 236)' }}>
                                    <div style={{ marginLeft: '12px', display: 'flex', gap: '239px', flexDirection: 'inline' }}>
                                        <p>Date of Employment: {formatDate(employee.date_of_employment)}</p>
                                        <p>Date of Application: {currentDate} </p>
                                    </div>
                                    <br />

                                    <div style={{ width: '100%', height: '40%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }} >
                                            <h1>Apply For Leave</h1> <button style={{ color: 'black', width: '20%' }} onClick={() => applyLeave()}>Calculate</button>
                                        </div>
                                        <br />
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }}>
                                            <p> From: </p> <input type='date' name='leave_start_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                                            <p>To: </p> <input input type='date' name='leave_end_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                                            <p>Total Days: {workingDays + Number(1)}</p>
                                        </div>
                                    </div>

                                    <br />

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
                            </>
                        ))}

                        <Modal isOpen={createAppliedLeaveModal} onRequestClose={closeAppliedLeaveLoader} className={modal}>

                            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                                <ClipLoader color={'green'} loading={loading} size={89} />
                                <div>
                                    <p>Issuing {workingDays + Number(1)} days of applied leave to {employeeName} </p>
                                </div>
                            </div>

                        </Modal>

                    </Modal>

                    <Modal isOpen={allLeaves} onRequestClose={closeAllLeaveModal} style={LeaveModal}>
                        <div style={smaller}>
                            <button style={buttons} onClick={() => setTab(0)}>Leave Forms</button>
                            <button style={buttons} onClick={() => setTab(1)}>Report</button>
                        </div>
                        <div style={AllLeavesStyle}>

                            {tab === 0 && <div style={leaves}>

                                <div style={{ width: '100%', marginTop: '15px', marginLeft: '12px', backgroundColor: 'rgb(163, 187, 197)', display: 'flex', gap: '12px', flexDirection: 'inline', flexWrap: 'wrap' }}>

                                    <button onClick={() => openAnnualLeave(IDF)} className='buttonx'>Annual Leave</button>
                                    {leavesTypes.map(leave => (
                                        <button style={button} key={leave.id} onClick={() => openOtherLeaveModal(leave.id)} >{leave.name}</button>
                                    ))}
                                </div>
                            </div>


                            }

                            {tab === 1 && <div style={report}>
                                <div>
                                    <DataTable
                                        data={otherLeavesReport}
                                        columns={column}
                                        pagination
                                    ></DataTable>
                                </div>

                            </div>}


                        </div>
                    </Modal>



                    <Modal isOpen={otherLeaves} onRequestClose={closeOtherLeavesModal} style={modal}>
                        {oneLeaveArray.map(leave => (
                            <div>
                                <div style={{ style: '100%', backgroundColor: 'white', display: 'flex', marginTop: '20px', justifyContent: 'center' }}>
                                    <h1>{employeeName} Requesting for {leave.name} Leave</h1>
                                </div>

                                <div style={{ width: '100%', height: '20%', backgroundColor: 'rgb(206, 206, 236)' }}>
                                    <div style={{ marginLeft: '12px', display: 'flex', marginTop: '12px', gap: '239px', flexDirection: 'inline' }}>
                                        <p>Date of Employment: Sinz</p>
                                        <p>Date of Application: {currentDate} </p>
                                    </div>
                                </div>
                                <div style={{ width: '100%', height: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }} >
                                        <h1>Apply For Leave</h1> <button style={{ color: 'black', width: '20%' }} onClick={() => applyOtherLeave(leave.name)}>Apply</button>
                                    </div>

                                    <br />


                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }}>
                                        <p> From: </p> <input type='date' name='leave_start_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                                        <p>To: </p> <input input type='date' name='leave_end_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                                        <p>Total Days: {workingDays}</p>
                                    </div>

                                    <br />

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }} >
                                        <textarea required name='description' placeholder='Reason / Description' style={textiee} value={description} onChange={(e) => setDescription(e.target.value)}>Reason / Description </textarea>
                                    </div>

                                </div>
                            </div>
                        ))}
                        <Modal isOpen={createModal} onRequestClose={closeCreateModal} className={modal}>
                            {oneLeaveArray.map(leave => (

                                <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                                    <ClipLoader color={'green'} loading={loading} size={89} />
                                    <div>
                                        <p>Issuing {workingDays} days of {leave.name} to {employeeName} </p>
                                    </div>
                                </div>
                            ))}
                        </Modal>

                    </Modal>

                    <Modal isOpen={leaving} style={modalSmall} >
                        <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: 'auto', backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Tick} style={svgStyle} />
                                <p style={{ color: 'white' }}>{employeeName} will be on leave for {workingDays + Number(1)} Days.</p>
                            </div>
                        </div>
                    </Modal>

                    <Modal isOpen={notLeaving} style={modalSmall} >
                        <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '99%', backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={Caution} style={svgStyle} />
                                <p style={{ color: 'white' }}>{employeeName} hasn't earned {workingDays} days...</p>
                            </div>
                        </div>
                    </Modal>

                </div>
            </div >

        </div >
    );
}

export default LeavePage;