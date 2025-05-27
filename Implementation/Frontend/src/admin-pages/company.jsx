import { React, useState, useEffect } from 'react';
import NavbarAdmin from './navbarAdmin';
import AddItem from '../images/addItem.svg';
import CentrikaLogo from '../images/centrika-removebg.png'
import Modal from 'react-modal';
import Logo from '../images/logo.svg';
import PuffLoader from "react-spinners/PuffLoader";
import Tick from '../images/tick.svg'
import Cross from '../images/cross.svg'
import axios from 'axios';
import Caution from '../images/caution.svg'
import Keys from '../keys';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import DataTable from 'react-data-table-component';


function Company() {

    // const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;

    // const socket = io.connect(`${ioPort}`);

    const Container = {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ' rgb(163, 187, 197)',
    };

    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
        display: 'flex',
        gap: '12px',
        flexDirection: 'inline'
    };

    const buttons = {
        borderRadius: '12px',
        width: '65px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        backgroundColor: 'rgb(163, 187, 197)'
    };

    const buttonsReplace = {
        borderRadius: '12px',
        width: '96px',
        color: 'black',
        cursor: 'pointer',
        padding: '12px 0px',
        backgroundColor: 'rgb(163, 187, 197)'
    };

    const CompanyButton = {
        height: '148px',
        width: '32%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };


    const smaller = {
        width: '100%',
        height: '15%',
        display: 'flex',
        // backgroundColor: 'green',
        flexDirection: 'inline',
        gap: '9px',
        alignItems: 'center',
        // justifyContent: 'center'
    };

    const allDiv = {
        width: '90%',
        borderRadius: '12px',
        height: '87%',
        backgroundColor: 'rgb(163, 187, 197)'
    }

    const Selects = {
        width: '100%',
        height: '52px',
        color: 'black',
        border: 'none',
        borderRadius: '21px'
    };

    const Selectx = {
        width: '100%',
        height: '18%',
        color: 'black',
        border: 'none',
        borderRadius: '21px'
    };


    const Option = {
        width: '39%',
        height: '25%',
        display: 'flex',
        gap: '12px',
        color: 'white',
        backgroundColor: 'black',
        border: 'none',
        borderRadius: '14px'
    };



    const svgStyle = {
        width: '30px',
        height: '30px',
        borderRadius: '14px',
    }

    const openAddModal = () => {
        isAddModalOpen(true);
    };

    const closeAddModal = () => {
        isAddModalOpen(false);
        setLogo('');
        // window.location.reload();
    };

    const kindaStyle = {
        content: {
            width: '50%',
            height: '43%',
            display: 'flex',
            fontFamily: 'Arial, sans-serif',
            border: 'none',
            gap: '12px',
            borderRadius: '12px',
            backgroundColor: 'rgb(163, 187, 197)',
            marginLeft: '380px',
            marginTop: '120px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    const companyModal = {
        content: {
            width: '84%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            gap: '12px',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '12px',
            backgroundColor: 'white',
            overflowY: 'auto', // Enable scrolling for the modal content
            scrollbarWidth: 'thin', // Custom scrollbar width
            msOverflowStyle: 'none', // Hide default scrollbar for IE/Edge
            marginLeft: '160px',
            marginTop: '-33px',
        },
        overlay: {
            position: 'fixed', // Ensure the overlay covers the entire viewport
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20, // Bring the modal to the front
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the background
            display: 'flex',
        },
    };


    const modal = {
        overlay: {
            zIndex: '20',
        },
        content: {
            width: '25%',
            marginLeft: '495px',
            height: '76vh',
            border: 'none',
            borderRadius: '12px',
            gap: '23px',
            color: "black",
            padding: '12px 0px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    };

    const modalx = {
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

    const serialModal = {
        overlay: {
            zIndex: '20',
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
        },
        content: {
            width: '55%',
            marginLeft: '275px',
            height: '76vh',
            border: 'none',
            borderRadius: '12px',
            // backgroundColor: 'blue',
            gap: '23px',
            scrollbarWidth: 'none',
            color: "black",
            padding: '12px 0px',
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            alignItems: 'center',
        },
    }


    const info = {
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    };

    const issue = {
        width: '100%',
        height: '100%',
        gap: '12px',
        borderRadius: '12px',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    };

    const report = {
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        backgroundColor: 'rgb(163, 187, 197)',
        display: 'flex',
        flexDirection: 'inline'
    }

    const logoButton = {
        width: '25%',
        gap: '9px',
        height: '98%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'grey',
        backgroundColor: 'white'
    };

    const parent = {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        overflow: 'auto',
        backgroundColor: 'rgb(185, 185, 234)',
    };

    const scrollable = {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        borderRadius: '15px',
        height: '100%',
        padding: ' 8px',
        overflow: 'auto'
    };

    const [AddModalOpen, isAddModalOpen] = useState(false);
    const [logo, setLogo] = useState('');
    const [infoCompany, setInfoCompany] = useState([]);
    const [companyImages, setCompanyImages] = useState({});
    const [companyModalOpen, isCompanyModalOpen] = useState(false);
    const [oneCompanyID, setOneCompanyID] = useState('');
    const [oneCompany, setOneCompany] = useState([]);
    const [imageForOneCompany, setImageForOneCompany] = useState('');
    const [category, setCategory] = useState([]);
    const [dateOfRequisition, setDateOfRequisition] = useState('');
    const [selectedItem, setSelectedItem] = useState(Number);
    const [tab, setTab] = useState(0);
    const [firstParts, setFirstParts] = useState([]);
    const [selectedFirstPart, setSelectedFirstPart] = useState('');
    const [serialDontExist, setSerialDontExist] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [item, setItem] = useState([]);
    const [supervisor, setSupervisor] = useState([]);
    const [totalAmount, setTotalAmount] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [data, setData] = useState([]);
    const [serialMatch, setSerialMatch] = useState('');
    const [allMatchingSerials, setAllMatchingSerials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [CompanyName, setCompanyName] = useState('');
    const [quantity, setQuantity] = useState();
    const [totalIn, setTotalIn] = useState([]);
    // const [isIssueLoaderOpen, setIssueLoaderOpen] = useState(false);
    const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
    const [realQuantityForLoader, setRealQuantityForLoader] = useState('');
    const [gaveOut, setGaveOut] = useState(false);
    const [someSerialsOut, setSomeSerialsOut] = useState(false);
    const [errorInGiving, setErrorInGiving] = useState(false);
    const [inputValidation, setInputValidation] = useState(false);
    const [serialShow, setSerialShow] = useState([]);
    const [dateExpose, setDateExpose] = useState('');
    const [gaveOutOne, setGaveOutOne] = useState(false);
    const [replace, setReplace] = useState('');
    const [takenSerials, setTakenSerials] = useState([]);
    const [startSingleItem, setStartSingleItem] = useState('');
    const [endSingleItem, setEndSingleItem] = useState('');
    const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false);
    // const openIssueLoader = (ID) => {
    //     setIssueLoaderOpen(true);
    //     handleIssue(ID);
    // }

    // const closeIssueLoader = () => {
    //     setIssueLoaderOpen(false);
    // }


    const openDeliveryNote = (ID) => {
        handleDeliveryNoteForOneCompany(ID);
    };

    const closeMonthlyReport = () => {
        setIsMonthlyReportOpen(false)
    }

    const openCompanyModal = (ID, CompanyName) => {
        isCompanyModalOpen(true);
        setOneCompanyID(ID);
        setCompanyName(CompanyName)
        fetchOneCompany(ID, CompanyName);

    };

    const closeCompanyModal = () => {
        setImageForOneCompany('')
        setData('');
        setOneCompanyID('');

        setSerialMatch('');
        setAllMatchingSerials([]);
        isCompanyModalOpen(false);
    };

    const openSerialModal = (ID, serialID, startFrom, endTo, itemID, date) => {
        handleOpenSerialExpose(ID, serialID, startFrom, endTo, itemID, date);
        setIsSerialModalOpen(true);
    };

    const closeSerialModal = () => {
        setSerialShow('');
        setDateExpose('');
        setIsSerialModalOpen(false);
    };

    useEffect(() => {
        setLogo(Logo);
    }, []);


    const fetchOneCompany = async (ID, CompanyName) => {
        if (!ID || !CompanyName) return;

        try {
            const imageRef = ref(storage, `companyLogos/${CompanyName}`);
            const imageURL = await getDownloadURL(imageRef);
            setImageForOneCompany(imageURL);
        } catch (error) {
            console.error("Error fetching company logo: ", error);
            setImageForOneCompany(null); // Optional: Fallback image
        }

        try {
            const responsee = await axios.get(`${url}/gets-one/${ID}`);
            setData(responsee.data.records);
            // console.log('@Reponse Data amount: ', responsee.data);

            // console.log("Total Taken", responsee.data.totalAmount);
            setTotalAmount(responsee.data.totalAmount);

        } catch (error) {
            console.error("Error fetching data for ID: ", error);
        }

        try {
            const response = await axios.get(`${url}/get-one-company/${ID}`);
            setOneCompany(response.data);
        } catch (error) {
            console.error("Error fetching company details: ", error);
        }
    };


    const updateFileName = (event) => {
        const selectedLogo = event.target.files[0];
        setLogo(selectedLogo);
    };

    const [company, setCompany] = useState({
        name: '',
        number: '',
        email: '',
    });

    const handleChange = (event) => {
        setCompany((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleMakeModal = () => {
        handleMake();
        closeAddModal();
    }

    const handleMake = async () => {

        if (logo == null) return;

        try {

            const IdForQuotation = company.name;
            console.log("ID FOR COMPANY PIC: ", IdForQuotation);
            const imageRef = ref(storage, `companyLogos/${logo.name, IdForQuotation}`);
            uploadBytes(imageRef, logo).then(() => {
            });

            const response = await axios.post(`${url}/add-company`, company);

            setInterval(() => {
                closeAddModal();
            }, 2700);

        } catch (error) {
            console.error("Error: ", error);
        }
    };

    // useEffect(() => {
    //     const fetchIDs = async () => {
    //         try {
    //             const response = await axios.get(`${url}/get-company-id`);
    //             const latestID = response.data[0].id
    //             setLatestID(latestID);
    //         } catch (error) {
    //             console.log("Error: ", error);
    //         };
    //     };
    //     fetchIDs();
    // }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${url}/get-company`);
                setInfoCompany(response.data);

                // Fetch images for each company
                const storage = getStorage();
                const imageFetches = response.data.map(async (company) => {
                    const imageRef = ref(storage, `companyLogos/${company.CompanyName}`);
                    try {
                        const imageURL = await getDownloadURL(imageRef);
                        return { [company.CompanyName]: imageURL };
                    } catch (error) {
                        // console.error(`Error fetching image for company ${company.CompanyName}: `);
                        // return { [company.id]: console.log("No Image") };
                    }
                });

                const images = await Promise.all(imageFetches);
                const imagesMap = Object.assign({}, ...images);
                setCompanyImages(imagesMap);
            } catch (error) {
                // console.error("Error: ", error);
            }
        };

        if (url) {
            fetchCompanies();
        };

    }, [url]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${url}/category`);
                setCategory(response.data);
            } catch (error) {
                // console.error("Error: ", error);
            };
        };
        fetchCategory();
    }, []);


    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
    };

    const handleOpenSerialExpose = async (ID, serialID, startFrom, endTo, itemID, date) => {
        try {

            console.log("SerialID: ", serialID);

            const dateFormatted = formatDate(date)

            if (serialID === 0) {
                const responsee = await axios.get(`${url}/get-multiple-taken/${startFrom}/${endTo}/${itemID}/${oneCompanyID}`);
                setSerialShow(responsee.data);
                setDateExpose(dateFormatted)
            } else if (serialID >= 0) {
                const response = await axios.get(`${url}/get-serial-id/${serialID}/${ID}`);
                setDateExpose(dateFormatted);
                setSerialShow(response.data);

            };

        } catch (error) {
            console.error("Error: ", error);
        }
    }


    useEffect(() => {
        const fetchItem = async (selectedCategory) => {
            try {
                const response = await axios.get(`${url}/items/${selectedCategory}`);
                setItem(response.data);
            } catch (error) {
                // console.error("Error: ", error);
            };
        };
        if (selectedCategory) {
            fetchItem(selectedCategory);
        };
    }, [selectedCategory]);


    const handleItemChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedItem(selectedValue);
    };


    useEffect(() => {
        const fetchSuper = async () => {
            try {
                const response = await axios.get(`${url}/get-supervisor`);
                setSupervisor(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        };
        fetchSuper();
    }, []);


    const handleSupervisorChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedSupervisor(selectedValue);
    };


    // const handleQuantity = (event) => {
    //     setQuantity(event.target.value)
    // };

    const [from, setFrom] = useState(Number);
    const [to, setTo] = useState(Number);

    useEffect(() => {
        const bring = async () => {
            try {
                const response = await axios.get(`${url}/get-total-in/${selectedItem}`);
                setTotalIn(response.data);
            } catch (error) {
                // console.error("Error: ", error);
            }
        };

        if (selectedItem) {
            bring();
        }
    }, [selectedItem]);

    // const handleIssue = async (ID) => {

    //     try {

    //         if (totalIn.totalIn >= quantity) {

    //             const response = await axios.get(`${url}/get-one-company-for-delivery/${oneCompanyID}/${ID}`);

    //             const data = (response.data);


    //             const date = new Date();

    //             const messageDatas = {
    //                 itemID: selectedItem,
    //                 company: oneCompanyID,
    //                 requestor: selectedSupervisor,
    //                 date: date,
    //                 amount: quantity,
    //             };

    //             // await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${quantity}`);

    //             const remaining = Number(Number(totalIn.totalIn) - Number(quantity));

    //             const status = 'Out';
    //             const retour = 'none'

    //             await axios.put(`${url}/change-status-from-notifications-for-bulkx`, messageDatas).then(
    //                 await axios.post(`${url}/take-one-daily-transaction/${selectedItem}/${quantity}/${parseInt(selectedSupervisor)}/${status}/${retour}/${remaining}/${oneCompanyID}`)
    //             );

    //             setInterval(() => {
    //                 setIssueLoaderOpen(false);
    //             }, 2700);

    //         } else {
    //             setInterval(() => {
    //                 setIssueLoaderOpen(false);
    //             }, 2700);

    //             return window.alert("Insufficient Amount...");
    //         }

    //     } catch (error) {
    //         console.error("Error: ", error);
    //     };
    // };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const column = [
        {
            name: 'Item',
            selector: row => row.itemName
        },
        {
            name: 'Issuer',
            selector: row => row.employeeName
        },
        {
            name: 'Date',
            selector: row => formatDate(row.date)
        },
        {
            name: 'Amount',
            selector: row => (
                <button onClick={() => { openSerialModal(row.id, row.serialID, row.startFrom, row.endTo, row.itemID, row.date) }} style={{ backgroundColor: 'white', color: 'blue' }}>{row.amount}</button>
            )
        },
        {
            name: 'Status',
            selector: row => row.status
        },
        {
            name: 'Delivery Note',
            selector: row => (
                <button onClick={() => openDeliveryNote(row.id)}>View</button>
            )
        }
    ];

    const columns = [
        {
            name: 'Date',
            selector: row => dateExpose,
        },
        {
            name: 'Serial Number',
            selector: row => row.serial_number
        }
    ]

    const handleDeliveryNoteForOneCompany = async (IDForDeliveryUseEffect) => {

    };

    const handleThis = (ID) => {
        try {
            fetchOneCompany(ID);
            setTab(2);
        } catch (error) {
            // console.error("Error: ", error);
        }
    }

    const handleFirstPartChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedFirstPart(selectedValue);
    };


    useEffect(() => {
        const handleSerialHunt = async (selectedItem) => {
            try {
                const response = await axios.get(`${url}/get-all-first-parts/${selectedItem}`);
                setFirstParts(response.data);

            } catch (error) {
                console.error("Error: ", error);
            };
        }

        if (selectedItem) {
            handleSerialHunt(selectedItem);
        };

    }, [selectedItem]);

    const bulkOutFunction = async () => {

        if (from > to) {

            try {
                const numbers = [];
                const wholeWordArray = [];

                for (let i = from; i >= to; i--) {
                    numbers.push(i);
                };

                numbers.forEach((number) => {
                    const take = selectedFirstPart + ' ' + number;
                    wholeWordArray.push(take);
                });

                const checkIfOut = await axios.get(`${url}/serial-numbers-validation/${wholeWordArray}`);
                const check = await axios.get(`${url}/check/${wholeWordArray}`);

                if (checkIfOut.data.message === 'All Good!!!') {
                    if (check.data === 'All serial_numbers exist') {

                        const realQuantity = numbers.length;
                        setRealQuantityForLoader(realQuantity);
                        const status = 'Out';
                        const retour = 'none';
                        const remaining = Number(Number(totalIn.totalIn) - Number(realQuantity));
                        const serialID = 0;
                        const startFrom = Number(from);
                        const endTo = Number(to);

                        await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${realQuantity}/${dateOfRequisition}/${serialID}/${startFrom}/${endTo}/${selectedFirstPart}`).then(
                            await axios.put(`${url}/take-give-out-bulk/${selectedItem}/${wholeWordArray}/${oneCompanyID}/${selectedSupervisor}`).then(
                                await axios.post(`${url}/take-one-daily-transaction/${selectedItem}/${realQuantity}/${(parseInt(selectedSupervisor))}/${status}/${retour}/${remaining}/${oneCompanyID}`)
                            ).then(
                                // window.alert(`Gave Out ${realQuantity} Serial Numbers ~~~ `)
                                setGaveOut(true),

                                setInterval(() => {
                                    setGaveOut(false)
                                }, 2700),
                            )
                        );
                    } else {
                        // window.alert("Required Serials Dont Exist");
                        setSerialDontExist(true);

                        setInterval(() => {
                            setSerialDontExist(false);

                        }, 2700);
                    }

                } else {
                    // window.alert("Some Of Serial Numbers Were Given Out!");
                    setSomeSerialsOut(true);

                    setInterval(() => {
                        setSomeSerialsOut(false);
                    }, 2700)
                }

            } catch (error) {
                // window.alert("Error In Giving Out Multiple Serial Numbers")
                setErrorInGiving(true);

                setInterval(() => {
                    setErrorInGiving(false)
                }, 2700);

                console.error("Error: ", error);

            }
        } else {
            // window.alert("Not following Input Rules");
            setInputValidation(true);

            setInterval(() => {
                setInputValidation(false);
            }, 2700);
        }
    };

    useEffect(() => {
        let isMounted = true; // To track if the component is still mounted
        const fetchSerialMatch = async (serialMatch) => {
            try {
                const response = await axios.get(`${url}/get-serial-match/${serialMatch}`);
                if (isMounted) {
                    setAllMatchingSerials(response.data);
                }
            } catch (error) {
                console.error("Error fetching serial match: ", error);
            }
        };

        if (serialMatch) {
            fetchSerialMatch(serialMatch);
        }

        return () => {
            isMounted = false; // Cleanup on component unmount or dependency change
        };
    }, [serialMatch]); // Only re-run when `serialMatch` changes

    const handleGiveOutOneSerialChoice = async (serialID) => {
        try {

            const realQuantity = 1;
            const status = 'Out';
            const retour = 'none';
            const c = selectedItem;
            const supervisor = selectedSupervisor
            const remaining = Number(Number(totalIn.totalIn) - Number(1));
            const startFrom = 0;
            const endTo = 0;
            const first_part = 'none';

            await axios.put(`${url}/give-out-one-serial-by-choice/${serialID}/${oneCompanyID}/${supervisor}`).then(
                await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${realQuantity}/${dateOfRequisition}/${serialID}/${startFrom}/${endTo}/${first_part}`).then(
                    await axios.post(`${url}/take-one-daily-transaction/${c}/${realQuantity}/${parseInt(supervisor)}/${status}/${retour}/${remaining}/${oneCompanyID}`).then(
                        setSerialMatch(''),
                        setAllMatchingSerials([]),
                        // window.alert("Serial Given OUT~~~~")
                        setGaveOutOne(true),

                        setInterval(() => {
                            setGaveOutOne(false)
                        }, 2700),

                    )
                )
            )

        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const handleDelete = async (ID, CompanyName) => {
        try {

            const storage = getStorage();

            const fileRef = ref(storage, `companyLogos/${CompanyName}`);

            deleteObject(fileRef)
                .then(() => {
                    console.log("Company Deleted Well");
                }).catch((error) => {
                    console.error("Error:", error);
                });

            await axios.delete(`${url}/delete-company/${ID}`);

        } catch (error) {
            console.error("Error: ", error);
        };
    };

    useEffect(() => {
        let isMounted = true;
        const func = async (replace) => {
            try {
                const response = await axios.get(`${url}/get-taken-serials/${replace}`);
                setTakenSerials(response.data);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        if (replace) {
            func(replace);
        }

        return () => {
            isMounted = false;
        };

    }, [replace]);

    const handleThisToo = async (ID) => {
        try {
            fetchOneCompany(ID);
            setTab(3);
        } catch (error) {
            // console.error("Error: ", error);
        };
    };


    const [deliveryID, setDeliveryID] = useState(Number);
    const [replaceID, setReplaceID] = useState(Number);

    const handleDelivered = async (id, serial_number) => {
        try {
            setAllMatchingSerials([]);
            setSerialMatch(serial_number);
            setDeliveryID(id)

            setTimeout(() => {
                setAllMatchingSerials([]);
            }, 100)

        } catch (error) {
            console.error("Error: ", error);
        }
    };


    const handleReplace = async (id, serial_number) => {
        try {
            setTakenSerials([]);
            setReplace(serial_number);
            setReplaceID(id)

            setTimeout(() => {
                setTakenSerials([]);
            }, 100)

        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const [replaceSmall, setReplaceSmall] = useState(false)

    const handleReplacement = async () => {
        try {

            const realQuantity = 1;
            const status = 'Out';
            const retour = 'none';
            const c = selectedItem;
            const remaining = Number(Number(totalIn.totalIn) - Number(1));
            const startFrom = 0;
            const endTo = 0;
            const first_part = 'none';


            await axios.post(`${url}/post-replacement/${replaceID}/${deliveryID}/${oneCompanyID}`).then(
                await axios.put(`${url}/change-delivery-status/${deliveryID}/${oneCompanyID}`).then(
                    await axios.put(`${url}/change-replace-status/${replaceID}`).then(
                        await axios.post(`${url}/post-company-records/${selectedItem}/${oneCompanyID}/${selectedSupervisor}/${realQuantity}/${dateOfRequisition}/${deliveryID}/${startFrom}/${endTo}/${first_part}`).then(
                            setReplaceSmall(true),
                            setInterval(() => {
                                setReplaceSmall(false)
                            }, 2700),
                        )
                    )
                )
            )

        } catch (error) {
            console.error("Error: ", error);
        }
    };

    const [replacementData, setReplacementData] = useState([]);

    useEffect(() => {
        const func = async (oneCompanyID) => {
            try {
                const response = await axios.get(`${url}/get-replacement-data/${oneCompanyID}`);
                setReplacementData(response.data);

            } catch (error) {
                console.error("Error: ", error);
            }
        }
        if (oneCompanyID) {
            func(oneCompanyID)
        }
    }, [oneCompanyID, replacementData]);

    const columnx = [
        {
            name: 'Date',
            selector: row => formatDate(row.date)
        },
        {
            name: 'Delivered',
            selector: row => row.deliverySerial
        },
        {
            name: 'Item',
            selector: row => row.deliveryItemName
        },
        {
            name: 'Replacement',
            selector: row => row.replacementSerial
        },
        {
            name: 'Item',
            selector: row => row.replacementItemName
        }
    ];

    const handleMonthlyReport = () => {
        setIsMonthlyReportOpen(true)
        MonthlyReport();
    }

    const [serialNumbersForSingleCompany, setSerialNumbersForSingleCompany] = useState([]);

    const MonthlyReport = async () => {
        try {
            const responsee = await axios.get(`${url}/get-serial-number-in-different-time-company/${startSingleItem}/${endSingleItem}/${oneCompanyID}`);
            setSerialNumbersForSingleCompany(responsee.data);
        } catch (error) {
            console.error("Error: ", error);
        };
    };

    const columnz = [
        {
            name: 'Serial Number',
            selector: row => row.serial_number
        },
        {
            name: 'State Of Item',
            selector: row => row.state_of_item
        },
        {
            name: 'Date',
            selector: row => formatDate(row.date)
        },
        {
            name: 'Issuer',
            selector: row => row.username
        }
    ]

    return (
        <div>
            <NavbarAdmin></NavbarAdmin>
            <div style={kain}>
                <h1>Company Tab</h1>
                <button className='addItem-btn' onClick={() => openAddModal()}><img src={AddItem} style={svgStyle} /></button>
            </div>

            <div style={Container}>
                <div className="terms-admin">
                    {infoCompany.map(company => (
                        <button key={company.id} style={CompanyButton} onClick={() => openCompanyModal(company.id, company.CompanyName)}>
                            {companyImages && companyImages[company.CompanyName] ? (
                                <img
                                    src={companyImages[company.CompanyName]}
                                    alt={`${company.CompanyName} logo`}
                                    style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            ) : (
                                <PuffLoader color={'white'} loading={loading} size={81} />
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>{company.CompanyName}</p>
                                <p>{company.email}</p>
                                <p>{company.number}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <Modal isOpen={AddModalOpen} onRequestClose={closeAddModal} style={kindaStyle}>
                <input style={{ display: 'none' }} id="file" type="file" accept="image/*" onChange={updateFileName} />
                <label htmlFor="file" style={logoButton}>
                    {logo ? (
                        <img src={logo} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }} />

                    ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}

                    <strong>Insert Logo</strong>
                </label>

                <div style={{ marginLeft: '50px', width: '40%', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                    <input type='text' placeholder='Company Name' style={{ width: '100%' }} name='name' onChange={handleChange} />
                    <input type='text' placeholder='Company Number' style={{ width: '100%' }} name='number' onChange={handleChange} />
                    <input type='text' placeholder='Company Email' style={{ width: '100%' }} name='email' onChange={handleChange} />
                </div>

                <button style={{ backgroundColor: 'green', height: '20%', width: '15%', marginTop: '11%', color: 'white' }} onClick={() => handleMakeModal()} >Add</button>

            </Modal>

            <Modal isOpen={companyModalOpen} onRequestClose={closeCompanyModal} style={companyModal}>
                <div style={smaller}>
                    <button style={buttons} onClick={() => setTab(0)}>Info</button>
                    <button className='buttony' onClick={() => setTab(1)}>Issue</button>
                    <button style={buttons} onClick={() => handleThis(oneCompanyID)}>Report</button>
                    <button style={buttonsReplace} onClick={() => handleThisToo(oneCompanyID)}>Replacement</button>
                    <p>Total Items Taken By This Company: {totalAmount}</p>
                    <p>From: </p><input type='date' style={{ width: '10%', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={(e) => setStartSingleItem(e.target.value)} />
                    <p>To: </p><input type='date' style={{ width: '10%', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={(e) => setEndSingleItem(e.target.value)} />
                    <button style={buttons} onClick={() => handleMonthlyReport()}>Generate</button>
                </div>

                <div style={allDiv}>
                    {tab === 0 && <div style={info}>
                        <div style={{ width: '20%', height: '100%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>

                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh', backgroundColor: 'white' }} />}
                        </div>

                        <div style={{ width: '40%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div>

                                {oneCompany.map(one => (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <p>Name:{one.CompanyName}</p>
                                        <p>Email:{one.email}</p>
                                        <p>Number:{one.number}</p>
                                        <div style={{ width: '100%', height: '20%', display: 'flex', flexDirection: 'inline', gap: '12px' }}>
                                            <button style={{ borderRadius: '12px', width: '76%', backgroundColor: 'white' }}>Update</button>
                                            <button onClick={() => handleDelete(one.id, one.CompanyName)} style={{ borderRadius: '12px', width: '75%', backgroundColor: 'red' }}>Delete</button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                    }


                    {tab === 1 && <div style={issue}>
                        <div style={{ width: '20%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '30%', height: '60%', alignItems: 'center', display: 'flex', marginTop: '60px', gap: '12px', flexDirection: 'column' }}>
                            <select onChange={handleCategoryChange} value={selectedCategory} style={Selects}>
                                <option value='' disabled>Select Category</option>
                                {category.map(categories => (
                                    <option key={categories.id} value={categories.id} style={Option} >{categories.category_name}</option>
                                ))}
                            </select>

                            <select onChange={handleItemChange} value={selectedItem} style={Selects}>
                                <option value='' disabled>Select Item</option>
                                {item.map(items => (
                                    <option key={items.id} value={items.id} style={Option} >{items.name}</option>
                                ))}
                            </select>

                            {/* <input type='text' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} placeholder='Quantity' name='quantity' onChange={handleQuantity} /> */}
                            <input type='date' style={{ width: '100%', height: '52px', color: 'black', paddingLeft: '6px', backgroundColor: 'white', border: 'none', borderRadius: '12px' }} onChange={(e) => setDateOfRequisition(e.target.value)} />

                            <select onChange={handleSupervisorChange} value={selectedSupervisor} style={Selects}>
                                <option value='' disabled>Select Issuer</option>
                                {supervisor.map(supers => (
                                    <option key={supers.id} value={supers.id} style={Option} >{supers.username}</option>
                                ))}
                            </select>

                            {/* <button style={{ backgroundColor: 'white', width: '40%' }} onClick={() => openIssueLoader(oneCompanyID)}>Issue Out</button> */}
                            {/* <button style={{ backgroundColor: 'white', width: '20%' }} onClick={() => openDeliveryNote()}>Issue Out</button> */}

                        </div>

                        <div style={{ width: '50%', height: '100%', gap: '12px', display: 'flex', marginTop: '60px', flexDirection: 'inline' }} >
                            <div style={{ width: '50%', height: '60%', gap: '9px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                {/* <button>Find Serials</button> */}
                                <select onChange={handleFirstPartChange} value={selectedFirstPart} style={Selectx}>
                                    <option value='' disabled>Select First Part</option>
                                    {firstParts.map((first_part, index) => (
                                        <option key={index} value={first_part} style={Option} >{first_part}</option>
                                    ))}
                                </select>
                                <input type='text' placeholder='From (Bigger)' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} onChange={(e) => setFrom(e.target.value)} />
                                <input type='text' placeholder='To (Smaller)' style={{ width: '100%', color: 'black', backgroundColor: 'white' }} onChange={(e) => setTo(e.target.value)} />
                                <button style={{ backgroundColor: 'white', width: '50%' }} onClick={() => bulkOutFunction()}>Bulk Out</button>
                            </div>
                            <div style={{ width: '50%', height: '60%', display: 'flex', flexDirection: 'column', marginRight: '9px' }} >
                                <input
                                    type="text"
                                    placeholder="Search Serial Number"
                                    style={{ width: '100%', color: 'black', backgroundColor: 'white', }}
                                    onChange={(e) => setSerialMatch(e.target.value)}
                                />
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {allMatchingSerials.map((serial) => (
                                        <button
                                            key={serial.id}
                                            style={{ width: '100%', height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: 'white', color: 'black' }}
                                            onClick={() => handleGiveOutOneSerialChoice(serial.id)}
                                        >
                                            <p style={{ display: 'flex', marginLeft: '9px' }}>
                                                {serial.serial_number}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                            </div>

                        </div>


                    </div>
                    }

                    {tab === 2 && <div style={report} >
                        <div style={{ width: '25%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={parent}>
                            <div style={scrollable}>
                                <DataTable
                                    columns={column}
                                    data={data}
                                // pagination
                                ></DataTable>

                            </div>
                        </div>
                    </div>
                    }
                    {tab === 3 && <div style={report} >
                        <div style={{ width: '25%', display: 'flex', marginLeft: '12px', alignItems: 'center' }}>
                            {imageForOneCompany ? (
                                <img src={imageForOneCompany} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '20px' }} />

                            ) : <img src={Logo} style={{ maxWidth: '90%', maxHeight: '15vh' }} />}
                        </div>

                        <div style={{ width: '28%', position: 'relative', overflow: 'hidden', padding: '10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', }}>
                            <input type="text" placeholder="Delivered..." style={{ width: '100%', height: '12%', backgroundColor: 'white', color: 'black', }} value={serialMatch} onChange={(e) => setSerialMatch(e.target.value)} />

                            {serialMatch && (
                                <div
                                    style={{
                                        width: '100%',
                                        position: 'absolute',
                                        zIndex: 10,
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        scrollbarWidth: 'none',
                                        marginTop: '50px',
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    {allMatchingSerials.map((serial) => (
                                        <button
                                            key={serial.id}
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'left',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                borderBottom: '1px solid #ddd',
                                            }}
                                            onClick={() => handleDelivered(serial.id, serial.serial_number)}
                                        >
                                            <p
                                                style={{
                                                    display: 'flex',
                                                    marginLeft: '9px',
                                                }}
                                            >
                                                {serial.serial_number}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}


                            <input type="text" placeholder="Replaced..." style={{ width: '100%', height: '12%', backgroundColor: 'white', color: 'black' }} value={replace} onChange={(e) => setReplace(e.target.value)} />
                            {replace && (
                                <div
                                    style={{
                                        width: '93%',
                                        position: 'absolute',
                                        zIndex: 10,
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        scrollbarWidth: 'none',
                                        marginTop: '200px',
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    {takenSerials.map((serial) => (
                                        <button
                                            key={serial.id}
                                            style={{
                                                width: '100%',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'left',
                                                backgroundColor: 'white',
                                                color: 'black',
                                                borderBottom: '1px solid #ddd',
                                            }}
                                            onClick={() => handleReplace(serial.id, serial.serial_number)}
                                        >
                                            <p
                                                style={{
                                                    display: 'flex',
                                                    marginLeft: '9px',
                                                }}
                                            >
                                                {serial.serial_number}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    width: '42%',
                                }}

                                onClick={() => handleReplacement()}
                            >
                                Replace
                            </button>
                        </div>
                        <div style={{ backgroundColor: 'white', marginRight: '9px', width: '50%', height: '100%' }}>
                            <DataTable
                                columns={columnx}
                                data={replacementData}
                            >
                            </DataTable>

                        </div>

                    </div>
                    }
                </div>
            </Modal>

            {/* <Modal isOpen={isIssueLoaderOpen} onRequestClose={closeIssueLoader} style={modal} >
                <div style={{ display: 'flex', flexDirection: 'column', zIndex: '20', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
                    <SyncLoader color={'green'} loading={loading} size={19} />
                    <br />
                    <p>Please Wait...</p>
                </div>
            </Modal> */}

            <Modal isOpen={isSerialModalOpen} onRequestClose={closeSerialModal} style={serialModal}>
                <div style={{ width: '100%', left: '0px', display: 'flex', flexDirection: 'inline' }}>
                    <img src={CentrikaLogo} style={{ width: '200px', height: '130px' }} />
                    <p style={{ width: '60%', fontSize: '17px', marginTop: '57px', fontFamily: 'Arial, sans-serif', }}>List of Serial Numbers taken By {CompanyName} On {dateExpose} </p>
                    <br />
                    <p style={{ fontSize: '17px', marginTop: '57px', fontFamily: 'Arial, sans-serif', }}>Count: {serialShow.length}</p>
                </div>
                <div style={{ width: '100%', fontFamily: 'Arial, sans-serif' }}>
                    <DataTable
                        data={serialShow}
                        columns={columns}
                    >
                    </DataTable>
                </div>
            </Modal>

            <Modal isOpen={isMonthlyReportOpen} onRequestClose={closeMonthlyReport} style={serialModal}>
                <div style={{ width: '100%', left: '0px', display: 'flex', flexDirection: 'inline' }}>
                    <img src={CentrikaLogo} style={{ width: '200px', height: '130px' }} />
                    <p style={{ width: '60%', fontSize: '17px', marginTop: '57px', fontFamily: 'Arial, sans-serif', }}>List of Serial Numbers taken By {CompanyName} </p>
                    <br />
                    <p style={{ fontSize: '17px', marginTop: '57px', fontFamily: 'Arial, sans-serif', }}>Count: {serialNumbersForSingleCompany.length}</p>
                </div>
                <div style={{ width: '100%', fontFamily: 'Arial, sans-serif' }}>
                    <DataTable
                        data={serialNumbersForSingleCompany}
                        columns={columnz}
                    >
                    </DataTable>
                </div>
            </Modal>

            <Modal isOpen={gaveOut} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Tick} style={svgStyle} />
                        <p style={{ color: 'white' }}>Gave Out {realQuantityForLoader} Serial Numbers.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={gaveOutOne} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '90%', backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Tick} style={svgStyle} />
                        <p style={{ color: 'white' }}>Serial Number Went Out Sucessfully.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={someSerialsOut} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '90%', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Cross} style={svgStyle} />
                        <p style={{ color: 'white' }}>Some Serial Numbers Were Given Out.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={errorInGiving} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '90%', backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Cross} style={svgStyle} />
                        <p style={{ color: 'white' }}>Error In Giving Out Multiple Serial Numbers.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={inputValidation} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '90%', backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Caution} style={svgStyle} />
                        <p style={{ color: 'white' }}>Not Following Input Rules.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={replaceSmall} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '70%', backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Tick} style={svgStyle} />
                        <p style={{ color: 'white' }}>Replaced Successfully.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={serialDontExist} style={modalx} >
                <div style={{ display: 'flex', zIndex: '20', border: 'none', flexDirection: 'inline', marginTop: '-574px', height: '6vh', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', zIndex: '20', border: 'none', fontFamily: 'Arial, sans-serif', gap: '12px', flexDirection: 'inline', borderRadius: '20px', height: '99%', width: '100%', backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Caution} style={svgStyle} />
                        <p style={{ color: 'white' }}>Serial Numbers Entered Don't Exist In Inventory.</p>
                    </div>
                </div>
            </Modal>


        </div>
    );
};
export default Company;