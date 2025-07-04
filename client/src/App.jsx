// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import AuthBox from './AuthBox';
import Header from './Header';
import LogoutButton from './LogoutButton';
import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState(null);

  function handleLogin(credentials) {
    const login = async () => {
      try {
        const res = await fetch('http://localhost:54321/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          console.error('Login failed');
        }
      } catch (err) {
        console.error('Error logging in: ', err);
      }
    };

    login();
  }

  function handleRegister(credentials) {
    const register = async () => {
      try {
        const res = await fetch('http://localhost:54321/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          console.error('Login failed');
        }
      } catch (err) {
        console.error('Error logging in: ', err);
      }
    };

    register();
  }

  function handleLogout() {
    const logout = async () => {
      try {
        const res = await fetch('http://localhost:54321/logout', {method: 'POST'});

        if (res.ok) {
          setUsername(null);
        } else {
          console.error('Logout failed');
        }
      } catch (err) {
        console.error('Error logging out: ', err);
      }
    }

    logout();
  }


  return (
    <div>
      <Header title='Nutrition Tracker' username={username}/>
      {!username ? (
        <AuthBox onLogin={handleLogin} onRegister={handleRegister}/>
      ) : (
        <LogoutButton onLogout={handleLogout}/>
      )}
      
    </div>
  );
}

export default App;
