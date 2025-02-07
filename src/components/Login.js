import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${!isSignIn ? "active" : ""}`}>
      <div className="pizza-corner pizza-corner-top-right"></div>
      <div className="pizza-corner pizza-corner-bottom-left"></div>
        <div className="form-container sign-in">
          <div className="auth-form-container">
            <div className="form-header">
              <h1>Sign In</h1>
              <p className="divider">Use your email password</p>
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
              <a href="#" className="forgot-password">
                Forgot Your Password?
              </a>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-btn">
                SIGN IN
              </button>
            </form>
          </div>
        </div>

        <div className="form-container sign-up">
          <div className="auth-form-container">
            <div className="form-header">
              <h1>Create Account</h1>
              <p className="divider">Use your email password</p>
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
              {error && <p className="error-message">{error}</p>}
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
              <p>Already have an account, sign in by clicking below</p>
              <button
                className="switch-btn"
                onClick={() => setIsSignIn(true)}
              >
                SIGN IN
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h2>Welcome to Dishcovery!</h2>
              <p>Don't have an account, create one by clicking below</p>
              <button
                className="switch-btn"
                onClick={() => setIsSignIn(false)}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;