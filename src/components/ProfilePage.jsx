import React, { useState } from 'react';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  // Create state variables for each input field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

  // Handle changes to input fields
  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleEmailChange = (e) => {
    // Only allow alphabets, numbers, and @ symbol in email
    const updatedEmail = e.target.value.replace(/[^a-zA-Z0-9@.]/g, '');
    setEmail(updatedEmail);
  };
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);  // Validate password on change
  };
  const handleRetypeNewPasswordChange = (e) => setRetypeNewPassword(e.target.value);

  // Password validation function
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{16,}$/;
    if (password.length < 16) {
      setPasswordError("Password must be at least 16 characters.");
    } else if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter.");
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
    } else if (!/(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError("");  // No error if the password matches the requirements
    }
  };

  // Toggle the password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div>
      <main className={styles.maincontent}>
        <div className={styles.pageheader}>
          <h1>My Profile</h1>
        </div>
        <div className={styles.profilecard}>
          <div className={styles.profileheader}>
            <div className={styles.profileimage}>
              <img src="" alt="Profile" />
            </div>
            <button className={styles.editbutton}>
              <svg className={styles.editicon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <div className={styles.formgrid}>
            <div className={styles.formgroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={handleFullNameChange}
                pattern="^[a-zA-Z ]+$" // Allow only alphabets and spaces
                title="Only letters and spaces are allowed"
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                pattern="^[a-zA-Z0-9@.]+$" // Allow only alphanumeric characters, @ and dot
                title="Only alphanumeric characters, @ and . are allowed"
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label>Gender</label>
              <select
                value={gender}
                onChange={handleGenderChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div className={styles.formgroup}>
              <label>Country</label>
              <select
                value={country}
                onChange={handleCountryChange}
                required
              >
                <option value="">Select Country</option>
                {/* Example countries */}
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Austrian Empire">Austrian Empire</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Baden">Baden</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Bavaria">Bavaria</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin (Dahomey)">Benin (Dahomey)</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="Brunei">Brunei</option>
                <option value="Brunswick and Lüneburg">Brunswick and Lüneburg</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso (Upper Volta)">Burkina Faso (Upper Volta)</option>
                <option value="Burma">Burma</option>
                <option value="Cabo Verde">Cabo Verde</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Central American Federation">Central American Federation</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo Free State">Congo Free State</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote Ivoire">Cote d’Ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czechia">Czechia</option>
                <option value="Czechoslovakia">Czechoslovakia</option>
                <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Duchy of Parma">Duchy of Parma</option>
                <option value="East Germany (German Democratic Republic)">East Germany (German Democratic Republic)</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Eswatini">Eswatini</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Federal Government of Germany">Federal Government of Germany</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Grand Duchy of Tuscany">Grand Duchy of Tuscany</option>
                <option value="Greece">Greece</option>
                <option value="Grenada">Grenada</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">United States</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Hanover">Hanover</option>
                <option value="Hanseatic Republics">Hanseatic Republics</option>
                <option value="Hawaii">Hawaii</option>
                <option value="Hesse">Hesse</option>
                <option value="Holy See">Holy See</option>
                <option value="Honduras">Honduras</option>
                <option value="Honduras">Honduras</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kingdom of Serbia/Yugoslavia">Kingdom of Serbia/Yugoslavia</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea">Korea</option>
                <option value="Kosovo">Kosovo</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Lew Chew">Lew Chew</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mecklenburg">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">Micronesia</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Namibia">Namibia</option>
                <option value="Nassau">Nassau</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="North German Confederation">North German Confederation</option>
                <option value="North German Union">North German Union</option>
                <option value="North Macedonia">North Macedonia</option>
                <option value="Norway">Norway</option>
                <option value="Oldenburg">Oldenburg</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Panama">Panama</option>
                <option value="Papal States">Papal States</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Piedmont-Sardinia">Piedmont-Sardinia</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Qatar">Qatar</option>
                <option value="Republic of Genoa">Republic of Genoa</option>
                <option value="South Korea">South Korea</option>
                <option value="Republic of the Congo">Republic of the Congo</option>
                <option value="Romania">United States</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Schaumburg-Lippe">Schaumburg-Lippe</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Sudan">South Sudan</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Texas">Texas</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-Leste">Timor-Leste</option>
                <option value="Togo">Togo</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Two Sicilies">Two Sicilies</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="Union of Soviet Socialist Republics">Union of Soviet Socialist Republics</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Württemberg">Württemberg</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
            </div>

            {/* Instruction for password requirements */}
            <div className={styles.formgroup}>
              <p className={styles.passwordInstructions}>
                <strong>Password Requirements:</strong>
                <ul>
                  <li>At least 16 characters</li>
                  <li>At least one special character</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                </ul>
              </p>
            </div>

            <div className={styles.formgroup}>
              <label>Current Password</label>
              <input
                type={showPassword ? 'text' : 'password'}  // Toggle password visibility
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                minLength="16" // Minimum password length of 16
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label>New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}  // Toggle password visibility
                value={newPassword}
                onChange={handleNewPasswordChange}
                minLength="16" // Minimum password length of 16
                required
              />
              {passwordError && <p className={styles.errorText}>{passwordError}</p>}
            </div>
            <div className={styles.formgroup}>
              <label>Retype New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}  // Toggle password visibility
                value={retypeNewPassword}
                onChange={handleRetypeNewPasswordChange}
                minLength="16"
                required
              />
            </div>
            <button type="button" onClick={togglePasswordVisibility} className={styles.showPasswordButton}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;