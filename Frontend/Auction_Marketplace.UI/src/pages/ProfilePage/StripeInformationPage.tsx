import React, { useState } from 'react';
import './StripeInformationPage.css';

const NameForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCode(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Country:', country);
    console.log('City:', city);
    console.log('Street:', street);
    console.log('Postal Code:', postalCode);
    console.log('Phone:', phone);
    console.log('Date of Birth:', dateOfBirth);
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="formbold-form-title">
            <h2>Stripe Form</h2>
            <p></p>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="firstname" className="formbold-form-label">
                First name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                className="formbold-form-input"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="formbold-form-label">
                Last name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="formbold-form-input"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
          </div>

          {/* Additional inputs for country, city, street, postal code, phone, and date of birth */}
          <div className="formbold-input-flex">
            <div>
              <label htmlFor="country" className="formbold-form-label">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                className="formbold-form-input"
                value={country}
                onChange={handleCountryChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="formbold-form-label">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                className="formbold-form-input"
                value={city}
                onChange={handleCityChange}
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="street" className="formbold-form-label">
                Street
              </label>
              <input
                type="text"
                name="street"
                id="street"
                className="formbold-form-input"
                value={street}
                onChange={handleStreetChange}
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="formbold-form-label">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                className="formbold-form-input"
                value={postalCode}
                onChange={handlePostalCodeChange}
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="phone" className="formbold-form-label">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="formbold-form-input"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="formbold-form-label">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="formbold-form-input"
                value={dateOfBirth}
                onChange={handleDateOfBirthChange}
              />
            </div>
          </div>

          <button type="submit" className="formbold-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;