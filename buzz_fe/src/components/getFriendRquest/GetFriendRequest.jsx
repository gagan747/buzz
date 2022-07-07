/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import './GetFriendRequest.css';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { getFriendRequests, acceptFriendRequest, cancelFriendRequest } from '../../config';

function GetFriendRequest() {
  const [friendRequestData, setFriendRequestData] = useState([]);
  const loadRequest = async () => {
    try {
      const response = await fetch(
        getFriendRequests,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log(data);
      setFriendRequestData(data);
      // setFriendRequestData([1,2,3,4,5,6,7,5,4,33,5,6,78,54]);
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  const handleConfirmReq = async (friendId) => {
    try {
      const response = await fetch(
        `${acceptFriendRequest}/${friendId}`,
        {
          method: 'POST',
        },
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 201) {
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
    loadRequest();
  };
  const handleDeleteReq = async (friendId) => {
    console.log(friendId, 'd');
    try {
      const response = await fetch(
        `${cancelFriendRequest}/${friendId}`,
        {
          method: 'POST',
        },
      );
      const data = await response.json();
      console.log(data);
      if (response.status === 201) {
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
    loadRequest();
  };
  useEffect(() => {
    loadRequest();
  }, []);
  return (
    <>
      <Navbar />
      <div className="row py-5 px-4">
        <div className="col-md-7 mx-auto">
          <div className="bg-white shadow rounded primary-box overflow-auto">
            <div className="header  p-3 sticky-top">
              <h3>
                <FontAwesomeIcon icon={faUserFriends} />
&nbsp;
                Friend Requests
              </h3>
              <hr className="my-2" />
            </div>

            {friendRequestData
              && friendRequestData.map((friendData) => (
                <div key={friendData._id}>
                  <div className=" col-xl-12 col-sm-3 ">
                    <div className="d-flex justify-content-between mx-5 my-2">
                      <div className="d-flex align-items-center">
                        <img
                          src={friendData.profile_img}
                          className="img-box small-round-pic  round-img"
                          alt="..."
                        />
                        <div className="px-1">
                          <Link to="/viewProfile" state={{ id: friendData._id }}>
                            <h5 className="my-1 text-info">
                              {`${friendData.firstname} ${friendData.lastname}`}
                            </h5>
                          </Link>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <div
                          className="btn btn-primary m-1"
                          onClick={() => handleConfirmReq(friendData._id)}
                        >
                          Confirm
                        </div>
                        <div
                          className="btn btn-outline-danger m-1"
                          onClick={() => handleDeleteReq(friendData._id)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                    <hr className="text-info" />
                  </div>
                </div>
              ))}
            {friendRequestData.length === 0 && (
              <div className="">
                <h3 className="d-flex align-content-center justify-content-center my-5">
                  No Pending Requests
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GetFriendRequest;
