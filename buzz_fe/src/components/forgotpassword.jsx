/* eslint-disable react/no-unescaped-entities */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordUrl, forgotPasswordOtpGeneratorUrl } from '../config';

export default function Forgotpassword() {
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowpassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const navigate = useNavigate();
  const emailhandle = useRef(null);
  const formdata = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(forgotPasswordUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message);
        navigate('/');
      } else { toast.error(data.message); }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  const handleSend = async () => {
    try {
      if (!emailhandle.current.value) { return toast.error("Email can't be empty"); }
      setLoading(true);
      const response = await fetch(forgotPasswordOtpGeneratorUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.status === 201) { toast.success(data.message); } else { toast.error(data.message); }
    } catch (err) {
      setLoading(false);
      toast.error('Something went wrong');
    }
  };
  return (
    <div className="vh-100" style={{ backgroundColor: '#eee' }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card " style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h2 fw-bold  mx-1 mx-md-5 mb-5 pb-5">Password Assistance</p>
                    <form className="mx-1 mx-md-4 mt-5" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-2">
                        <i className="fa fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input name="email" type="email" ref={emailhandle} className="form-control border-top-0 border-left-0 border-right-0" placeholder="Email" onChange={(e) => { formdata(e); }} required />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-2">
                        <i className={loading ? 'fa fa-spinner fa-spin fa-lg me-sm-3 me-l-3 me-xl-0 fa-fw' : 'fa fa-circle fa-lg me-3 fa-fw'} />
                        <div className="col-10 form-outline flex-fill mb-0">
                          <input name="otp" type="text" className="form-control  ml-xl-0 border-top-0 border-left-0 border-right-0" placeholder="OTP" onChange={(e) => { formdata(e); }} required />
                        </div>
                        <button
                          type="button"
                          className="btn col-xl-2 col-sm-2 ml-xl-4 btn-success btn-sm rounded-pill"
                          onClick={() => {
                            handleSend();
                          }}
                          disabled={loading}
                        >
                          Send
                        </button>
                      </div>
                      <div className="d-flex flex-row align-items-center  mb-2">
                        <i className="fa fa-lock fa-lg me-3 fa-fw " />
                        <div className="form-outline  mb-0">
                          <input type={showpassword ? 'text' : 'password'} name="newpassword" className="form-control  border-top-0 border-left-0 border-right-0" placeholder="new password" onChange={(e) => { formdata(e); }} required />
                        </div>
                        <i
                          onClick={() => {
                            setShowpassword(!showpassword);
                          }}
                          className="fa fa-eye  fa-lg  fa-fw ml-xl-0 "
                        />
                      </div>
                      <div style={{ margin: '50px' }} className=" row justify-content-around mx-4 mb-5  mb-lg-4">
                        <button type="submit" style={{ fontWeight: 'bold' }} className="btn btn-sm m-2 col-xl-7 col-sm-12  btn-primary  rounded-pill ">Reset Password</button>
                      </div>
                    </form>
                  </div>
                  <div className="d-flex flex-column  my-5 col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://www.socialsamosa.com/wp-content/uploads/2013/09/image001-1.jpg" className="img-fluid rounded" alt="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1473843963/cdy69xpmmkjntymhbxpa.png" />
                    <p className="text-center mt-5 h4 mx-1 mx-md-5 mb-4 ">
                      Don't have an account?
                      <Link to="/signup">Register</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
