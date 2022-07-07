/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { friendContext } from './FriendsContext';
import { unfriend, getFriends } from '../config';

export default function Friends() {
  const FriendContext = useContext(friendContext);
  const allfriends = useRef([]);
  const filteredfriends = [];
  useEffect(() => {
    loadfriends();
  }, [FriendContext.rerender]);
  const [friends, setFriends] = useState([]);
  const unFriend = async (friend_id) => {
    try {
      const response = await fetch(`${unfriend}/${friend_id}`, { method: 'POST' });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        loadfriends();
        FriendContext.forceRender();
      } else {
        toast.error(result.message);
        loadfriends();
        FriendContext.forceRender();
      }
    } catch (err) {
      console.log(err);
      toast.error('Something wemt wrong');
    }
  };
  const loadfriends = async () => {
    try {
      const response = await fetch(getFriends);
      const result = await response.json();
      if (response.status === 200) {
        setFriends(result);
        allfriends.current = result;
      } else { console.log(result.message); }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSearch = (e) => {
    const inputstring = e.target.value.trim();
    if (!inputstring) {
      setFriends(allfriends.current);
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
    allfriends.current.map((friend) => {
      if (e.target.value.indexOf(' ') !== -1) {
        if (regexfirst.test(friend.firstname) && regexlast.test(friend.lastname)) { filteredfriends.push(friend); }
      } else if (regexfirst.test(friend.firstname) || regexlast.test(friend.lastname)) filteredfriends.push(friend);
    });
    setFriends(filteredfriends);
  };
  return (
    <div className="friends-container ">
      <div className="friends-search sticky-top">
        <input onChange={handleSearch} type="text" id="input" placeholder="Friends" />
        <label htmlFor="input"><i className="fa fa-search" aria-hidden="true" /></label>
      </div>
      {friends.map((friend) => (
        <div className="users-container">
          <span>
            {' '}
            <img
              className="image"
              src={friend.profile_img}
              width="34px"
              height="34px"
            />
            {' '}
            {'  '}
            <Link to="/viewProfile" state={{ id: friend._id }}>
              <span className="fullname">{`${friend.firstname} ${friend.lastname}`}</span>
            </Link>
          </span>
          <span>
            <button onClick={() => unFriend(friend._id)} type="button" className="btn btn-sm btn-primary">Unfriend</button>
          </span>
        </div>
      ))}
    </div>
  );
}
