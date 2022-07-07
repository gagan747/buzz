/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable react/react-in-jsx-scope */
import './addfeed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { feedContext } from './Feed';
import { feedUrl, homeUrl } from '../config';

function AddFeed() {
  const obj = useContext(feedContext);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text) {
      const formdata = new FormData();
      formdata.append('text', text);
      // formdata.append("createdBy", createdBy);
      if (selectedFile) { formdata.append('photos', selectedFile, selectedFile.name); }

      try {
        setLoader(true);
        const response = await fetch(feedUrl, {
          method: 'POST',
          body: formdata,
        });

        const data = await response.json();
        if (response.status === 201) {
          toast.success(data.message);
          obj.addfeed(data.feed);
        } else toast.error(data.message);
        setLoader(false);
      } catch (error) {
        toast.error(error);
        setLoader(false);
      }
    } else {
      toast.error('text must have 5 characters');
    }
  };
  const imageUploader = (x) => {
    setSelectedFile(x);
  };
  const islogged = async () => {
    try {
      const response = await fetch(homeUrl, {
        method: 'GET',
      });

      const data = await response.json();

      setProfileImg(data.profileImg);
      if (response.status === 307) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    islogged();
  }, []);

  return (
    <div className="addFeed ">
      <div className="addFeedWrapper">
        <form onSubmit={handleSubmit}>
          <div className="addFeedTop d-flex align-items-center">
            <img
              className="addFeedImg"
              src={profileImg}
              alt="profileImg"
            />
            <input
              type="text"
              placeholder="start a post"
              className="feedInput"
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="addFeedBottom">
            <label htmlFor="file">
              <div className="feedAddMedia">
                <FontAwesomeIcon
                  icon={faImages}
                  className="addFileIcon"
                />
                <span className="addFileText">Add Photo</span>
                <input
                  type="file"
                  name="photos"
                  className="fileSelect"
                  id="file"
                  onChange={(e) => {
                    imageUploader(e.target.files[0]);
                  }}
                />
              </div>
            </label>

            <button type="submit" className="postButton " disabled={loader}>
              Post
            </button>
            {loader && <i className="fa fa-spinner fa-spin fa-lg me-sm-3 me-l-3 me-xl-0 fa-fw" />}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFeed;
