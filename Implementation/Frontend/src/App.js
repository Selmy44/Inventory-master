import React from 'react';
import './style.css';
import Modal from 'react-modal'
import Login from './employee-pages/login.jsx';
import Home from './employee-pages/home.jsx';
import Terms from './employee-pages/terms';
import Navbar from './employee-pages/navbar';
import Request from './employee-pages/request.jsx';
import Notification from './employee-pages/notification';
import CategoryAdmin from './admin-pages/category-admin.jsx';
import EmployeesAdmin from './admin-pages/employees-admin.jsx';
import ItemsAdmin from './admin-pages/items-admin.jsx';
import NotificationAdmin from './admin-pages/notification-admin.jsx';
import SupplierAdmin from './admin-pages/suppliers-admin.jsx';
import NavbarAdmin from './admin-pages/navbarAdmin.jsx';
import TermsAdmin from './admin-pages/terms.jsx';
import TransactionAdmin from './admin-pages/transactions.jsx';
import HomeAdmin from './admin-pages/home.jsx';
import Departments_Roles from './admin-pages/department&roles.jsx';
// import NavbarSuperVisor from './supervisor-pages/NavbarSuperVisor.jsx'
import SupervisorNotifier from './supervisor-pages/SuperVisorNotifier.jsx';
import NoPage from './employee-pages/NoPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

Modal.setAppElement('#root');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Routes>

        {/* 
        <NavbarSuperVisor />
        <Routes>
          <Route path="/notifier-supervisor" element={<SupervisorNotifier />} />
        </Routes> */}


        <NavbarAdmin />
        <Routes>
          <Route path="/notification-admin" element={<NotificationAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/supplier-admin" element={<SupplierAdmin />} />
          <Route path="/category-admin" element={<CategoryAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/employees-admin" element={<EmployeesAdmin />} />
          <Route path="/terms-admin" element={<TermsAdmin />} />
          <Route path="/transaction-admin" element={<TransactionAdmin />} />
          <Route path="/home-admin" element={<HomeAdmin />} />
          <Route path="/departments-and-roles-admin" element={<Departments_Roles />} />
        </Routes>


        <Navbar />
        <Routes>
          {/* <Route index path="/" element={<Login />} /> */}
          <Route path="/home-employee" element={<Home />} />
          <Route path="/notification-employee" element={<Notification />} />
          <Route path="/terms-employee" element={<Terms />} />
          <Route path="/request-employee" element={<Request />} />
        </Routes>

      </BrowserRouter>
      <BrowserRouter>
        {/* <NavbarAdmin />
        <Routes>
          <Route path="/notification-admin" element={<NotificationAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/supplier-admin" element={<SupplierAdmin />} />
          <Route path="/category-admin" element={<CategoryAdmin />} />
          <Route path="/items-admin" element={<ItemsAdmin />} />
          <Route path="/employees-admin" element={<EmployeesAdmin />} />
          <Route path="/terms-admin" element={<TermsAdmin />} />
          <Route path="/transaction-admin" element={<TransactionAdmin />} />
          <Route path="/home-admin" element={<HomeAdmin />} />
          <Route path="/departments-and-roles-admin" element={<Departments_Roles />} />
        </Routes> */}


        {/* <NavbarSuperVisor /> */}
        <Routes>
          <Route path="/notifier-supervisor" element={<SupervisorNotifier />} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
