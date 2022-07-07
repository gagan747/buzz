/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, React } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { loginApiUrl } from '../config';

export default function Login({ error }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate('/');
    }
  }, []);
  const [showpassword, setShowpassword] = useState(false);
  const [state, setState] = useState({
    email: '',
    password: '',
  });
  const formdata = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(loginApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });
      const data = await response.json();
      if (response.status == 200) {
        toast.success(data.message);
        localStorage.setItem('x-auth-token', response.headers.get('x-auth-token'));
        navigate('/home');
      } else { toast.error(data.message); }
    } catch (err) {
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
                    <p className="text-center h2 fw-bold  mx-1 mx-md-5 mb-5 pb-5">Login</p>
                    <form className="mx-1 mx-md-4 mt-5" onSubmit={handleSubmit}>
                      <div className="d-flex flex-row align-items-center mb-2">
                        <i className="fa fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input name="email" type="email" className="form-control border-top-0 border-left-0 border-right-0" placeholder="Email" onChange={(e) => { formdata(e); }} required />
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-2">
                        <i className="fa fa-lock fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <input type={showpassword ? 'text' : 'password'} name="password" className="form-control d-inline border-top-0 border-left-0 border-right-0" placeholder="password" onChange={(e) => { formdata(e); }} required />
                        </div>
                        <i onClick={() => { setShowpassword(!showpassword); }} className="d-inline fa fa-eye " />
                      </div>
                      <div style={{ margin: '50px' }} className=" row justify-content-around mx-4 mb-5  mb-lg-4">
                        <button type="submit" style={{ fontWeight: 'bold' }} className="btn m-2 col-xl-5 col-sm-12  btn-primary">Login</button>
                        <a href="http://localhost:5000/auth/google" role="button" aria-pressed="true" className="btn m-2  col-xl-5 col-sm-12 btn-danger ">
                          {' '}
                          <i className="fa fa-google-plus fa-lg me-3 fa-fw text-white" />
                        </a>
                      </div>
                      <div style={{ margin: '50px' }} className=" row justify-content-around mx-4 mb-5  mb-lg-4"><Link to="/forgotpassword">Forgot password?</Link></div>
                    </form>
                    {' '}
                  </div>
                  <div className="d-flex flex-column  my-5 col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://www.socialsamosa.com/wp-content/uploads/2013/09/image001-1.jpg" className="img-fluid rounded" alt="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1473843963/cdy69xpmmkjntymhbxpa.png" />
                    <p className="text-center mt-5 h5 mx-1 mx-md-5 mb-4 ">
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
