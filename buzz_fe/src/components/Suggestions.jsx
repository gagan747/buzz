/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
import React, {
  useEffect, useState, useRef, useContext,
} from 'react';
import { toast } from 'react-toastify';
import './suggestions.css';
import { Link } from 'react-router-dom';
import { friendContext } from './FriendsContext';
import { userContext } from '../pages/Home';
import {
  addFriendUrl, acceptFriendRequest, cancelFriendRequest, deleteFriendRequest, friendSuggestions,
} from '../config';

function Suggestions() {
  const FriendContext = useContext(friendContext);
  const { user_id } = useContext(userContext).user;
  const AddFriend = async (friend_id) => {
    try {
      const response = await fetch(`${addFriendUrl}/${friend_id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        loadSuggestions();
      } else {
        toast.error(result.message);
        loadSuggestions();
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const acceptRequest = async (friend_id) => {
    try {
      const response = await fetch(`${acceptFriendRequest}/${friend_id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        loadSuggestions();
      } else {
        toast.error(result.message);
        loadSuggestions();
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const rejectRequest = async (friend_id) => {
    try {
      const response = await fetch(`${cancelFriendRequest}/${friend_id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        loadSuggestions();
      } else {
        toast.error(result.message);
        loadSuggestions();
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const cancelRequest = async (friend_id) => {
    try {
      const response = await fetch(`${deleteFriendRequest}/${friend_id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        loadSuggestions();
      } else {
        toast.error(result.message);
        loadSuggestions();
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const handleButtons = (suggestion) => {
    if (suggestion.friends.mySentRequests.includes(user_id)) {
      return (
        <>
          <button onClick={() => acceptRequest(suggestion._id)} type="button" className="btn btn-sm btn-primary m-1">Accept</button>
          <button onClick={() => rejectRequest(suggestion._id)} type="button" className="btn btn-sm btn-primary">Reject</button>
        </>
      );
    }
    if (suggestion.friends.myFriendRequests.includes(user_id)) return (<button onClick={() => cancelRequest(suggestion._id)} type="button" className="btn btn-sm btn-primary mr-3 ">Cancel</button>);
    if (suggestion.friends.myFriends.includes(user_id)) return (<button type="button" className="btn btn-sm btn-primary">Friends</button>);
    return (<button onClick={() => AddFriend(suggestion._id)} type="button" className="btn btn-sm btn-primary ">Add Friend</button>);
  };
  const allsuggestions = useRef([]);
  const filteredsuggestions = [];
  useEffect(() => {
    loadSuggestions();
  }, [FriendContext.rerender]);
  const [suggestions, setSuggestions] = useState([]);
  const loadSuggestions = async () => {
    try {
      const response = await fetch(friendSuggestions);
      const result = await response.json();
      if (response.status === 200) {
        setSuggestions(result);
        allsuggestions.current = result;
      } else { console.log(result.message); }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSearch = (e) => {
    const inputstring = e.target.value.trim();
    if (!inputstring) {
      setSuggestions(allsuggestions.current);
      return;
    }
    let str = `^${e.target.value}`;
    let regexfirst = new RegExp(str, 'i');
    let str1 = `^${e.target.value}$`;
    let regexlast = new RegExp(str1, 'i');
    if (e.target.value.indexOf(' ') !== -1) {
      const namesplit = e.target.value.split(' ');
      str = `^${namesplit[0]}$`;
      str1 = `^${namesplit[1]}$`;
      regexfirst = new RegExp(str, 'i');
      regexlast = new RegExp(str1, 'i');
    }
    allsuggestions.current.map((suggestion) => {
      // const fullname=suggestion.firstname+" "+suggestion.lastname;
      if (e.target.value.indexOf(' ') !== -1) {
        if (regexfirst.test(suggestion.firstname) && regexlast.test(suggestion.lastname)) { filteredsuggestions.push(suggestion); }
      } else if (regexfirst.test(suggestion.firstname) || regexlast.test(suggestion.lastname)) filteredsuggestions.push(suggestion);
    });
    setSuggestions(filteredsuggestions);
  };
  return (
    <div className="users-suggestions ">
      <div className="suggestions-search sticky-top">
        <input onChange={handleSearch} type="text" id="input" placeholder="Suggestions" />
        <label htmlFor="input"><i className="fa fa-search" aria-hidden="true" /></label>
      </div>
      {suggestions.map((suggestion) => (
        <div className="users-container">
          <span>
            {' '}
            <img
              className="image"
              src={suggestion.profile_img}
              width="34px"
              height="34px"
            />
            {' '}
            {'  '}
            <Link to="/viewProfile" state={{ id: suggestion._id }}>
              <span className="fullname">{`${suggestion.firstname} ${suggestion.lastname}`}</span>
            </Link>
          </span>
          <span>
            {handleButtons(suggestion)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
