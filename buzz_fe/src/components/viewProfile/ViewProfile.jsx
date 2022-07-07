/* eslint-disable import/no-duplicates */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
// import { getUserProfileUrl } from '../../config';
import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';
import './viewProfile.css';
import { userContext } from '../../pages/Home';
import { viewProfileUrl } from '../../config';
import { deleteFriendRequest } from '../../config';
import { acceptFriendRequest } from '../../config';
import { cancelFriendRequest } from '../../config';
import { addFriendUrl } from '../../config';
import { getFriendFeedsUrl } from '../../config';
import Post from '../../pages/Post';

function ViewProfile() {
  const location = useLocation();
  const { id } = location.state;
  const [render, setRender] = useState(false);
  const [currUser, setCurrUser] = useState();
  const [email, setEmail] = useState();
  const [data, setData] = useState();
  const [feedsData, setfeedsData] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setlastName] = useState();
  const [designation, setDesignation] = useState();
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [getCountry, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [bio, setBio] = useState();
  const [postCount, setPostCount] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [profileImg, setProfileImg] = useState(
    'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8=',
  );
  useEffect(() => {
    getUserProfile();
    getfriendFeeds();
  }, [render]);

  const getUserProfile = async () => {
    try {
      const response = await fetch(`${viewProfileUrl}/${id}`, {
        method: 'GET',
      });
      const userData = await response.json();
      console.log(userData);
      setData(userData.user);
      setCurrUser(userData.currUserId);
      const dob = userData.user.dob.split('-');
      const date = dob[2].substring(0, 2);
      const month = dob[1];
      const year = dob[0];
      const formattedDate = `${year}-${month}-${date}`;

      setEmail(userData.user.email);
      setFirstName(userData.user.firstname);
      setlastName(userData.user.lastname);
      setProfileImg(userData.user.profile_img);
      setCountry(userData.user.country);
      setCity(userData.user.city);
      setState(userData.user.state);
      setFriendCount(userData.user.friends.myFriends.length);
      setDesignation(userData.user.designation);
      setBio(userData.user.bio);
      setAge(userData.user.age);
      setGender(userData.user.gender);
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const getfriendFeeds = async () => {
    try {
      const response = await fetch(`${getFriendFeedsUrl}/${id}`, {
        method: 'GET',
      });
      const feedsData = await response.json();
      console.log(feedsData.feeds);
      setfeedsData(feedsData.feeds);
      setPostCount(feedsData.feedCount);
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const cancelRequest = async (id) => {
    try {
      const response = await fetch(`${deleteFriendRequest}/${id}`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        setRender(!render);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };

  const AddFriend = async (id) => {
    try {
      const response = await fetch(`${addFriendUrl}/${id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        setRender(!render);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const acceptRequest = async (friend_id) => {
    try {
      const response = await fetch(`${acceptFriendRequest}/${friend_id}`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        setRender(!render);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const rejectRequest = async (id) => {
    try {
      const response = await fetch(`${cancelFriendRequest}/${id}`, {
        method: 'POST',
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        setRender(!render);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const handleButtons = (viewedUser) => {
    if (viewedUser.friends.mySentRequests.includes(currUser)) {
      return (
        <>
          <button
            onClick={() => acceptRequest(viewedUser._id)}
            type="button"
            className="btn btn-outline-success m-1 mx-2"
          >
            Accept Request
          </button>
          <button
            onClick={() => rejectRequest(viewedUser._id)}
            type="button"
            className="btn btn-outline-danger"
          >
            Reject Request
          </button>
        </>
      );
    }
    if (viewedUser.friends.myFriendRequests.includes(currUser)) {
      return (
        <button
          onClick={() => cancelRequest(viewedUser._id)}
          type="button"
          className="btn btn-outline-danger  "
        >
          Cancel Request
        </button>
      );
    }
    if (viewedUser.friends.myFriends.includes(currUser)) { return <div className="primary-btn">Friends</div>; }
    return (
      <button
        onClick={() => AddFriend(viewedUser._id)}
        type="button"
        className="btn btn-primary "
      >
        Add Friend
      </button>
    );
  };
  return (
    <>
      <Navbar />
      <div className="row py-5 px-4">
        <div className="col-md-7 mx-auto">
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="px-4 pt-0 pb-4 cover">
              <div className="media align-items-end profile-head">
                <div className="mr-3">
                  <img
                    src={profileImg}
                    alt="..."
                    width="130"
                    className="rounded mb-2 img-thumbnail profile"
                  />
                </div>
                <div className="media-body mb-5 text-white">
                  <h4 className={city ? 'mt-0 mb-2' : 'mt-0 mb-4'}>
                    {firstName}
                    &nbsp;
                    {lastName}
                  </h4>
                  {city && state && getCountry && (
                    <p className="medium mb-3">
                      {' '}
                      <i className="fa fa-map-marker mr-2" aria-hidden="true" />
                      {city}
                      ,&nbsp;
                      {state}
                      ,&nbsp;
                      {getCountry}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-light p-4 d-flex justify-content-end text-center">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">
                    {friendCount}
                  </h5>
                  <small className="text-muted">
                    {' '}
                    <i className="fa fa-users mr-1" aria-hidden="true" />
                    Friends
                  </small>
                </li>
                <li className="list-inline-item">
                  <h5 className="font-weight-bold mb-0 d-block">{postCount}</h5>
                  <small className="text-muted">
                    {' '}
                    <i className="fa fa-book mr-1" aria-hidden="true" />
                    Posts
                  </small>
                </li>
              </ul>
            </div>
            <div className="px-4 py-3">
              <h3 className="mb-0 mx-4 font-italic">About</h3>
              <div className="p-4 rounded shadow-sm bg-light">
                <p className="font-italic mb-0">{email}</p>
                {gender && age && (
                  <div>
                    <p className="font-italic mb-0">{gender}</p>
                    <p className="font-italic mb-0">{age}</p>
                  </div>
                )}
                {designation && bio && (
                  <div>
                    <p className="font-italic mb-0">{designation}</p>
                    <p className="font-italic mb-0">{bio}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mx-5 my-2">{data && handleButtons(data)}</div>
          </div>
        </div>
        {/* <div className="col-md-5">eferfg</div> */}
      </div>
    </>
  );
}

export default ViewProfile;
