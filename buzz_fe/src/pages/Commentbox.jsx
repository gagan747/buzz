/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-cycle */
import {
  useEffect, useState, useContext, useRef,
} from 'react';
import { toast } from 'react-toastify';
import './Comments.css';
import { useNavigate } from 'react-router-dom';
import { userContext } from './Home';
import { commentContext } from './Post';
import { commentUrl } from '../config';

export default function Commentbox({ data }) {
  const navigate = useNavigate();
  const currentUser = useContext(userContext);
  const obj = useContext(commentContext);
  const [updatetoggle, setUpdatetoggle] = useState(false);
  const [commentdata, setCommentdata] = useState(data.comment);
  const inputfocus = useRef(null);

  useEffect(() => {
    setCommentdata(data.comment);
  }, [data.comment]);
  useEffect(() => {
    if (updatetoggle) { inputfocus.current.focus(); }
  }, [updatetoggle]);
  const handleDelete = async () => {
    try {
      const result = await fetch(`${commentUrl}${data._id}`, {
        method: 'DELETE',
      });
      const resultdata = await result.json();
      if (result.status === 200) {
        toast.success(resultdata.message);
        obj.deleteComment(data._id);
      } else if (result.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else { toast.error(resultdata.message); }
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    try {
      if (updatetoggle) {
        const result = await fetch(`${commentUrl}${data._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: commentdata }),
        });
        const resultdata = await result.json();
        if (result.status === 200) { toast.success(resultdata.message); } else {
          toast.error(resultdata.message);
          return;
        }
      }
      setUpdatetoggle(!updatetoggle);
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  return (
    <div className="commentcontainer">
      <div>
        <img className="image" src={data.user_Id.profile_img} width="40px" height="40px" alt="" />
        <span style={{ marginLeft: '8px' }}>{`${data.user_Id.firstname} ${data.user_Id.lastname}`}</span>
      </div>
      <div className="commentedit">
        {
            (updatetoggle && <input ref={inputfocus} type="text" className="toggleinput" value={commentdata} onChange={(e) => { setCommentdata(e.target.value); }} />) || (
            <p>
              {' '}
              {commentdata}
            </p>
            )
          }
        {(data.user_Id._id === currentUser.user.user_id) && (
          <div className="icon-spacing">
            <i onClick={handleUpdate} className={(updatetoggle && 'updatebutton') || 'fa fa-pencil'} aria-hidden="true">{updatetoggle && 'Update'}</i>
            <i onClick={handleDelete} className="fa fa-remove" />
          </div>
        )}
      </div>
    </div>
  );
}
