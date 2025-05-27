import { Link } from 'react-router-dom';
import React from 'react';
import NavbarMain from './navbarMain';

function TermsHR() {

  return (
    <div>
      <NavbarMain></NavbarMain>
      <div className="terms-container-hr">
        <div className="terms-hr">
          <h1>Terms</h1>
          <p>By using the material requistion form you agree to the following terms and conditions:</p>
          <p>To properly manage the material.</p>
          <p>To use the material exclusively for appropriate business-related purposes.</p>
          <p>To bear the cost in-case the material is stolen, damaged or unproperly working due to reasons no related to what the material is meant for and not related to work.</p>
          <p>To return the material in-case it is not used.</p>
        </div>
      </div>
    </div>
  );
}

export default TermsHR;
