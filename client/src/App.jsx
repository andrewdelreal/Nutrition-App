// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import AuthBox from './AuthBox';
import Header from './Header';
import LogoutButton from './LogoutButton';
import PortionTable from './PortionTable';
import PortionForm from './PortionForm';

import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState(null);
  const [portions, setPortions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  function handleLogin(credentials) {
    const login = async () => {
      try {
        const res = await fetch('http://localhost:54321/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials),
          credentials: 'include',
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
          body: JSON.stringify(credentials),
          credentials: 'include',
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
        const res = await fetch('http://localhost:54321/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          setUsername(null);
          setPortions([]);
        } else {
          console.error('Logout failed');
        }
      } catch (err) {
        console.error('Error logging out: ', err);
      }
    }

    logout();
  }

  function handleAddPortion(newPortion) {
    const addPortion = async () => {
      try {
        newPortion['username'] = username; 

        const res = await fetch('http://localhost:54321/portion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPortion),
          credentials: 'include',
        });

        if (res.ok) {
          console.log('Succesfully inserted portion');
          fetchPortionsByDate(newPortion.date);
        } else {
          console.error('Error adding portion:', res.statusText);
        }
      } catch (err) {
        console.log('Error adding portion: ', err);
      }
    }

    addPortion();
  }

  function handlePortionDelete(portionId) {
    const deletePortion = async () => {
      try {
        const res = await fetch('http://localhost:54321/delete-portion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({portionId}),
          credentials: 'include',
        });

        if (res.ok) {
          console.log('Succesfully deleted portion');
          fetchPortionsByDate(selectedDate);
        } else {
          console.error('Error deleting portion:', res.statusText);
        }
      } catch (err) {
        console.log('Error deleting portion: ', err);
      }
    }

    deletePortion();
  }

  useEffect(() => {
    if (username) {
      fetchPortionsByDate(selectedDate);
    }
  }, [username, selectedDate]);

  async function fetchPortionsByDate(date) {
    try {
      const res = await fetch('http://localhost:54321/portion/get-portions', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, date }),
          credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setPortions(data);
      } else {
        console.error('Failed to fetch portions');
      }
    } catch (err) {
      console.error('Fetch error: ', err);
    }
  }

  async function fetchFoodsBySearch(query) {
    try {
      const res = await fetch('http://localhost:54321/get-foods', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        console.error('Failed to fetch foods');
        return [];
      }
    } catch (err) {
      console.error('Fetch error: ', err);
      return [];
    }
  } 

  return (
    <div>
      <Header title='Nutrition Tracker' username={username}/>
      {!username ? (
        <AuthBox onLogin={handleLogin} onRegister={handleRegister}/>
      ) : (
        <div>
          <LogoutButton onLogout={handleLogout}/>
          <PortionTable portions={portions} date={selectedDate} onDelete={handlePortionDelete}/>
          <PortionForm onDateChange={setSelectedDate} onFoodSearchChange={fetchFoodsBySearch} onSubmit={handleAddPortion}/>
        </div>
      )}
      
    </div>
  );
}

export default App;
