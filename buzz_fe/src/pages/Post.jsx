/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import React, {
  useState, createContext, useContext,
} from 'react';
import { toast } from 'react-toastify';
import './posts.css';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { userContext } from './Home';
import { feedContext } from '../components/Feed';
import { ModeratorUrl, feedUrl, commentUrl } from '../config';

const commentContext = createContext();
export { commentContext };
export default function Post({ post }) {
  const navigate = useNavigate();
  const currentuser = useContext(userContext);
  const feeds = useContext(feedContext);
  const [optionstoggle, setOptionstoggle] = useState(false);
  const [commentstoggle, setCommentstoggle] = useState(false);
  const [commentsdata, setCommentsdata] = useState([]);
  const [rerender, setRerender] = useState(false);
  const updateComments = (newcomment) => {
    setCommentsdata([...commentsdata, newcomment]);
  };
  const handlePostToggle = async () => {
    try {
      const response = await fetch(
        `${ModeratorUrl}poststatus/${post._id}`,
        { method: 'POST' },
      );
      const result = await response.json();
      if (response.status === 200) {
        feeds.updatefeed(result.data);
        setRerender(!rerender);
      } else if (response.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else { console.log(result.message); }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  const deleteComment = (id) => {
    setCommentsdata(commentsdata.filter((comment) => comment._id !== id));
  };
  const deletePost = async () => {
    try {
      const response = await fetch(`${feedUrl}${post._id}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        feeds.deletefeed(post._id);
      } else if (response.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else { toast.error(result.message); }
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const handleComment = async () => {
    try {
      setCommentstoggle(!commentstoggle);
      if (!commentstoggle) {
        const result = await fetch(`${commentUrl}${post._id}`);
        const comments = await result.json();
        if (result.status === 201) setCommentsdata(comments);
        else if (result.status === 307) {
          navigate('/');
          toast.error('User Not logged In');
        } else { toast.error(result.message); }
      }
    } catch (err) { toast.error('Something went wrong'); }
  };
  const handleFlag = async () => {
    try {
      const response = await fetch(
        `${feedUrl}flag/${post._id}`,
        { method: 'PUT' },
      );
      const result = await response.json();
      if (response.status === 200) {
        feeds.updatefeed(result);
        setRerender(!rerender);
      } else if (response.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else toast.error(result.message);
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const handleModerator = async () => {
    try {
      const response = await fetch(
        `${ModeratorUrl}deletepost/${post._id}`,
        { method: 'DELETE' },
      );
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        feeds.deletefeed(post._id);
      } else if (response.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else { toast.error(result.message); }
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };
  const handlelike = async () => {
    try {
      const response = await fetch(
        `${feedUrl}like/${post._id}`,
        { method: 'PUT' },
      );
      const result = await response.json();
      if (response.status === 200) {
        feeds.updatefeed(result);
        setRerender(!rerender);
      } else if (response.status === 307) {
        navigate('/');
        toast.error('User Not logged In');
      } else toast.error(result.message);
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };

  return (
    <commentContext.Provider
      value={{
        commentsdata,
        feed_Id: post._id,
        updateComments,
        deleteComment,
      }}
    >
      <div className={post.status === 'active' && 'postcontainer' || 'postcontainer opacity-50 pe-none'}>
        <div className="postcreator">
          <span>
            {' '}
            <img
              className="image"
              src={post.createdBy.profile_img}
              width="40px"
              height="40px"
              alt=""
            />
            <span style={{ marginLeft: '8px' }} className="fullname">
              {`${post.createdBy.firstname} ${post.createdBy.lastname}`}
            </span>
          </span>
          {(currentuser.user.is_Admin && (
          <span className="moderator-options">
            <span>
              {' '}
              {post.status === 'active' && (<i onClick={handlePostToggle} className="fa fa-solid fa-toggle-on text-success pe-auto  " aria-hidden="true" />) || (<i onClick={handlePostToggle} className="fa fa-solid fa-toggle-off pe-auto " aria-hidden="true" />)}
              <i
                onClick={handleModerator}
                className="fa fa-times"
                aria-hidden="true"
              />
            </span>
            {post.flagCount.length && (
            <i className="fa fa-flag text-danger pl-2" aria-hidden="true">
              {' '}
              :
              {post?.flagCount?.length}
            </i>
            ) || ''}
          </span>
          )) || (
            <span className="options-dropdown">
              <span
                onClick={() => {
                  setOptionstoggle(!optionstoggle);
                }}
              >
                ...
              </span>
              {optionstoggle && (
              <span>
                {(currentuser.user.user_id === post.createdBy._id && (
                <button
                  onClick={deletePost}
                  type="button"
                  className="btn btn-secondary btn-sm optionsbutton"
                >
                  Delete
                </button>
                )) || (
                <button
                  onClick={handleFlag}
                  type="button"
                  className=" px-2 btn btn-danger btn-sm optionsbutton"
                >
                  {(post.flagCount.indexOf(currentuser.user.user_id)
                              !== -1
                              && 'Unflag')
                              || 'Mark as Flag'}
                </button>
                )}
                {' '}
              </span>
              )}
            </span>
          )}
        </div>
        <div className="posttext">
          {post.text}
          {' '}
        </div>
        {post.imgLink && (
        <img
          className="postimage"
          src={post.imgLink}
          width="590px"
          height="400px"
          alt=""
        />
        )}
        <div className="like-comment-container">
          <div
            className={
                (post.likeCount.indexOf(currentuser.user.user_id) !== -1
                  && 'liked')
                || ''
              }
            onClick={handlelike}
          >
            {(post.likeCount.indexOf(currentuser.user.user_id) !== -1
                && `${(post.likeCount.length && post.likeCount.length || '')} Like`)
                || `${(post.likeCount.length && post.likeCount.length || '')} Like`}
            <i className="fa fa-thumbs-up m-2" aria-hidden="true" />
          </div>
          <div onClick={handleComment}>
            <button style={{ border: 'none', backgroundColor: 'white' }}>
              Comment
              <i className="fa fa-comment m-2" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {commentstoggle && <Comments />}
    </commentContext.Provider>
  );
}
