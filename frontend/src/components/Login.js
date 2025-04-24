import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Login = ({ setIsLoggedIn }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setError('Invalid Credentials. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        createdAt: new Date()
      });
  
      console.log("User successfully registered and added to Firestore");
      
      navigate('/login');  // Redirect to login page
      window.location.reload();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Sorry, these credentials are already taken.');
      } else {
        setError(error.message);
      }
    }
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${!isSignIn ? "active" : ""}`}>
        <div className="pizza-corner pizza-corner-top-right"></div>
        <div className="pizza-corner pizza-corner-bottom-left"></div>

        <div className={`form-container sign-in ${isMobile && !isSignIn ? "hidden" : ""}`}>
          <div className="auth-form-container">
            <div className="for-header">
              <h1>Sign In</h1>
              <p className="divider">Use your email and password</p>
            </div>
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <a href="#" className="forgot-password">
                Forgot Your Password?
              </a> */}
              {error && isSignIn && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        <div className={`form-container sign-up ${isMobile && isSignIn ? "hidden" : ""}`}>
          <div className="auth-form-container">
            <div className="for-header">
              <h1>Create Account</h1>
              <p className="divider">Use your email and password</p>
            </div>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && !isSignIn && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">
                SIGN UP
              </button>
            </form>
          </div>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h2>Welcome Back!</h2>
              <p>Already have an account? Sign in by clicking below</p>
              <button
                className="switch-btn"
                onClick={toggleForm}
              >
                SIGN IN
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h2>Welcome to Dishcovery!</h2>
              <p>Don't have an account? Create one by clicking below</p>
              <button
                className="switch-btn"
                onClick={toggleForm}
              >
                SIGN UP
              </button>
            </div>
            
            {isMobile && (
              <div className="mobile-toggle">
                <p>{isSignIn 
                  ? "Don't have an account? Create one by clicking below"
                  : "Already have an account? Sign in by clicking below"
                }</p>
                <button className="switch-btn" onClick={toggleForm}>
                  {isSignIn ? "SIGN UP" : "SIGN IN"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;