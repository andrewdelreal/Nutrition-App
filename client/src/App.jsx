// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import AuthBox from './AuthBox';
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
        console.error('Error loging in:', err);
      }
    };

    login();
  }

  return (
    <div>
      {!username ? (
        <AuthBox onLogin={handleLogin}/>
      ) : (
        <p>Please log in or register.</p>
      )}
      
    </div>
  );
}

export default App;
