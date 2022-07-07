/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-cycle */
import React, {
  createContext, useState, useEffect, useContext,
} from 'react';
import AddFeed from './AddFeed';
import POSTS from '../pages/POSTS';
import { userContext } from '../pages/Home';
import { apiUrl } from '../config';

const feedContext = createContext();
export { feedContext };
const pageLimit = 10;
function Feed({ children }) {
  console.log('from feeds');
  const [pageNumber, setPageNumber] = useState(1);
  let [feeds, setFeeds] = useState([]);
  const currentuser = useContext(userContext);
  const [noMore, setNoMore] = useState(true);
  const addfeed = (newFeed) => {
    setFeeds([newFeed, ...feeds]);
  };
  const updatefeed = (updatedfeed) => {
    feeds.map((feed) => {
      if (feed._id === updatedfeed._id) {
        feed.flagCount = updatedfeed.flagCount;
        feed.likeCount = updatedfeed.likeCount;
        feed.status = updatedfeed.status;
      }
    });
  };
  const deletefeed = (id) => {
    feeds = (feeds.filter((feed) => feed._id !== id));
    postload();
  };
  useEffect(() => {
    (currentuser.user.is_Admin !== 'notLoaded') && postload();
  }, [currentuser.user]);
  const postload = async () => {
    try {
      const response = await fetch(`${apiUrl}/${currentuser.user.is_Admin && ('moderator/getFeeds') || ('feed')}/?pageNumber=${pageNumber}&pageLimit=${pageLimit}`);
      const postsdata = await response.json();

      if (response.status === 200) {
        if (postsdata.feeds.length === 0 || postsdata.feeds.length < pageLimit) { setNoMore(false); }
        setFeeds([...feeds, ...postsdata.feeds]);
        setPageNumber(pageNumber + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getFeeds = () => {
    postload();
  };
  return (
    <feedContext.Provider
      value={{
        feeds,
        addfeed,
        deletefeed,
        updatefeed,
        getFeeds,
        noMore,
      }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center ">
        <AddFeed />
      </div>
      <POSTS />
      {children}
    </feedContext.Provider>
  );
}

export default Feed;
