/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';
import { userProfileUpdate, getUserProfileUrl } from '../../config';

function UserProfile() {
  const [email, setEmail] = useState();
  const [data, setData] = useState([]);
  const [firstName, setFirstName] = useState();
  const [lastName, setlastName] = useState();
  const [designation, setDesignation] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [getCountry, setCountry] = useState();
  const [getState, setState] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState();
  const [bio, setBio] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const [profileImg, setProfileImg] = useState(
    'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8=',
  );

  const getJsonData = async () => {
    try {
      const response = await fetch(
        'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json',
        {
          method: 'GET',
        },
      );
      if (response.status === 200) {
        const jsondata = await response.json();
        setData(jsondata);
      } else {
        toast.error('Failed,Try Again');
      }
    } catch (error) {
      toast.error('Failed,Try Again');
    }
  };
  const country = [...new Set(data.map((item) => item.country))];
  country.sort();

  useEffect(() => {
    getJsonData();
    getUserProfile();
  }, []);

  const handleCountry = (e) => {
    let states = data.filter((state) => state.country === e.target.value);
    states = [...new Set(states.map((item) => item.subcountry))];
    states.sort();
    setState(states);
  };
  const handleState = (e) => {
    let cities = data.filter((city) => city.subcountry === e.target.value);
    cities = [...new Set(cities.map((item) => item.name))];
    cities.sort();
    setCities(cities);
  };

  const imageUploader = (x) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImg(reader.result);
      }
    };
    if (x) reader.readAsDataURL(x);
    setSelectedFile(x);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setlastName(value);
    if (name === 'designation') setDesignation(value);
    if (name === 'dob') setDob(value);
    if (name === 'gender') setGender(value);
    if (name === 'bio') setBio(value);
    if (name === 'country') setCountry(value);
    if (name === 'state') setSelectedState(value);
    if (name === 'city') setSelectedCity(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();

    if (getCountry === undefined) {
      toast.error('Set Country');
      return;
    }
    formdata.append('country', getCountry);

    if (selectedCity === undefined) {
      toast.error('Set City');
      return;
    }
    formdata.append('city', selectedCity);

    if (getCountry === undefined) {
      toast.error('Set Country');
      return;
    }
    formdata.append('state', selectedState);

    formdata.append('firstname', firstName);
    formdata.append('lastname', lastName);
    formdata.append('gender', gender);
    formdata.append('dob', dob);
    formdata.append('bio', bio);
    formdata.append('designation', designation);

    if (selectedFile) formdata.append('profileImg', selectedFile, selectedFile.name);
    try {
      setLoader(true);
      const response = await fetch(
        userProfileUpdate,
        {
          method: 'PUT',
          body: formdata,
        },
      );

      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
        console.log(data.updatedUser);
        setLoader(false);
      } else {
        toast.error(data.message);
        setLoader(false);
      }
    } catch (error) {
      toast.error('Something wemt wrong');
      setLoader(false);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await fetch(getUserProfileUrl, {
        method: 'GET',
      });
      const userData = await response.json();
      console.log(userData);
      const dob = userData.dob.split('-');
      const date = dob[2].substring(0, 2);
      const month = dob[1];
      const year = dob[0];
      const formattedDate = `${year}-${month}-${date}`;

      setEmail(userData.email);
      setFirstName(userData.firstname);
      setlastName(userData.lastname);
      setProfileImg(userData.profile_img);
      setDesignation(userData.designation);
      setDob(formattedDate);
      setGender(userData.gender);
      setBio(userData.bio);
      // setCountry(userData.country);
      // setSelectedState(userData.state);
      // setSelectedCity(userData.city);
      // handleDynamicState(userData.country);
      // handleDynamicCity(userData.state);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="container-xl px-4 mt-4">
          <div className="row">
            <div className="col-xl-4">
              <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center">
                  <img
                    className="img-account-profile rounded-circle mb-2"
                    src={profileImg}
                    alt=""
                  />

                  <div className="small font-italic text-muted mb-4">
                    JPG or PNG no larger than 5 MB
                  </div>

                  <label className="fileLabel" htmlFor="file">
                    Choose Photo
                  </label>
                  <input
                    type="file"
                    name="photos"
                    className="file"
                    id="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                      imageUploader(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header"> Edit Account Details</div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="inputEmailAddress">
                      Email address
                    </label>
                    <div className="mail" id="inputEmailAddress">
                      {email}
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputFirstName">
                        First name
                      </label>
                      <input
                        className="form-control"
                        id="inputFirstName"
                        type="text"
                        placeholder="Enter your first name"
                        onChange={handleChange}
                        value={firstName}
                        name="firstName"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputLastName">
                        Last name
                      </label>
                      <input
                        className="form-control"
                        id="inputLastName"
                        type="text"
                        placeholder="Enter your last name"
                        onChange={handleChange}
                        value={lastName}
                        name="lastName"
                        required
                      />
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="desgName">
                        Designation
                      </label>
                      <input
                        className="form-control"
                        id="desgName"
                        type="text"
                        placeholder="Enter your Desgination"
                        onChange={handleChange}
                        value={designation}
                        name="designation"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="inputBirthday">
                        Date Of Birth
                      </label>
                      <input
                        className="form-control date"
                        id="inputBirthday"
                        type="date"
                        name="dob"
                        placeholder="Enter your date of birth"
                        onChange={handleChange}
                        value={dob}
                        required
                      />
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="gender">
                        Gender
                      </label>

                      <select
                        name="gender"
                        id="gender"
                        className="form-control drop-style"
                        onChange={handleChange}
                        value={gender}
                        required
                      >
                        <option defaultChecked>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="country">
                        Country
                      </label>

                      <select
                        name="country"
                        id="country"
                        className="form-control drop-style"
                        onChange={(e) => {
                          handleCountry(e);
                          handleChange(e);
                        }}
                        value={getCountry}
                        required
                      >
                        <option defaultChecked>Select Country</option>
                        {country.map((items) => (
                          <option key={items}>{items}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row gx-3 mb-3">
                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="state">
                        State
                      </label>

                      <select
                        name="state"
                        id="state"
                        className="form-control drop-style"
                        onChange={(e) => {
                          handleState(e);
                          handleChange(e);
                        }}
                        value={selectedState}
                        required
                      >
                        <option defaultChecked>Select State</option>
                        {getState.map((items) => (
                          <option key={items}>{items}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="small mb-1" htmlFor="gender">
                        City
                      </label>

                      <select
                        name="city"
                        id="city"
                        className="form-control drop-style"
                        onChange={handleChange}
                        value={selectedCity}
                        required
                      >
                        <option defaultChecked>Select City</option>
                        {cities.map((items) => (
                          <option key={items}>{items}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="bio">
                      Bio
                    </label>
                    <input
                      className="form-control"
                      id="bio"
                      type="text"
                      name="bio"
                      placeholder="Enter about yourself"
                      value={bio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {' '}
                  {loader && (
                    <i className="fa fa-spinner fa-spin fa-lg me-sm-3 me-l-3 me-xl-0 fa-fw" />
                  )}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loader}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default UserProfile;
