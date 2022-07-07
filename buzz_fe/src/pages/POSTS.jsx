
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post.jsx';
import { feedContext } from '../components/Feed.jsx';

export default function POSTS() {
  const FeedContext = useContext(feedContext);
  return (
    <InfiniteScroll
      dataLength={FeedContext.feeds.length}
      next={FeedContext.getFeeds}
      hasMore={FeedContext.noMore}
      loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
      endMessage={(
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      )}
    >
      {FeedContext.feeds.map((feed) => (
        <Post key={feed._id} post={feed} />
      ))}
    </InfiniteScroll>
  );
}
