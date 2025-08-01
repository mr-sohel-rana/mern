import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
// import SearchInput from "./form/SearchInput";
  import { useCart } from '../../context/cartContext';
  import { Badge } from 'antd';

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const[cart]=useCart();

  useEffect(() => {
    // Log the auth object once the component mounts
    console.log(auth);
  }, [auth]);

  const logouthandle = () => {
    setAuth({
      ...auth,
      user: null,
      token: ""
    });
    localStorage.removeItem('auth');

    // Clear the cart on logout
    // setCart([]);
    // localStorage.removeItem('cart');  // Clear cart from localStorage as well
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg  bg-body-tertiary p-2 fixed">
        <div className="container-fluid">
          {/* Brand Name */}
          <div className="navbar-brand">Ecommerce</div>

          {/* Toggle button for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {/* Align all links to the right */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* <SearchInput /> */}
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </Link>

                <ul className="dropdown-menu">
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/something-else">Something else here</Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/products">product</Link>
              </li>

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Registration</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img style={{height: "40px",width: "40px", borderRadius: "50%"}}
                      src={`http://localhost:5000/api/v1/single-image/${auth?.user?._id}`}/>
                      </Link>

                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link className="nav-link" to={`/dashboard/${auth?.user?.role === 1 ? 'admin' : 'user'}`}>Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <Link onClick={logouthandle} className="nav-link">Logout</Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Badge count={cart?.length}> 
                  <Link className="nav-link" to="/cart">Cart</Link>
                 </Badge>  
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
