import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { reduxSetAuthenticated, reduxSetUser } from '../store/actions';
import { useHistory, useLocation } from "react-router-dom";

const LoginPage = (props) => {
  let history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthenticating(true);
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok && response.status !== 200) {
        setError('Unauthorized');
        return;
      }

      props.reduxSetAuthenticated(true);
      props.reduxSetUser(username);
      setAuthenticating(false);
      let { from } = { from: { pathname: "/chats" } };
      history.replace(from);
    } catch (err) {
      setError("Something went wrong on authentication");
    }

    // setAuthenticating(false);

  }

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>{error}</div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default connect(null, { reduxSetAuthenticated, reduxSetUser })(LoginPage);