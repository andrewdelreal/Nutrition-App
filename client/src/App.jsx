import AuthBox from './AuthBox';
import Header from './Header';
import LogoutButton from './LogoutButton';
import PortionTable from './PortionTable';
import PortionForm from './PortionForm';
import FoodData from './FoodData';
import NutritionSummary from './NutritionSummary';
import FoodForm from './FoodForm';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

function App() {
    const [username, setUsername] = useState(null);
    const [portions, setPortions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
    const [foodData, setFoodData] = useState([]);
    const [summaryData, setSummaryData] = useState([]);

    function formatDates(portions) {    // Format the dates of the portions data
        return portions.map(portion => ({
            ...portion,
            date: format(new Date(portion.date), 'MMM dd, yyyy hh:mm a')  // Ensures string to prevent frontend from converting back to ISO
        }));
    }

    function handleLogin(credentials) {
        const login = async () => {
            try {
                const res = await fetch('http://localhost:54321/login', {   // login
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials),
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username);     // set username from the successfully logged in user
                    setSelectedDate(new Date().toISOString());  // set default portions to today
                    setFoodData([]);    // Default the food data
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
                const res = await fetch('http://localhost:54321/register', {    // register (add user to database) and login
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(credentials),
                    credentials: 'include',
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username);     // set username from the successfully logged in user
                    setSelectedDate(new Date().toISOString());  // set default portions to today
                    setFoodData([]);    // Default the food data
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
                const res = await fetch('http://localhost:54321/logout', {  // logout
                    method: 'POST',
                    credentials: 'include',
                });

                if (res.ok) {
                    setUsername(null);  // update username (hides everything but the login box)
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

                const res = await fetch('http://localhost:54321/portion', {     // add the portion from the portion form
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newPortion),
                    credentials: 'include',
                });

                if (res.ok) {
                    console.log('Succesfully inserted portion');
                    fetchPortionsByDate(newPortion.date);   // update the portions
                } else {
                    console.error('Error adding portion:', res.statusText);
                }
            } catch (err) {
                console.log('Error adding portion: ', err);
            }
        }

        addPortion();
    }

    function handleAddFood(newFood) {
        const addFood = async () => {
            try {
                const res = await fetch('http://localhost:54321/food', {    // add the food from the food form
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFood),
                    credentials: 'include',
                });

                if (res.ok) {
                    console.log('Successfully added food');
                } else {
                    console.log('Error adding food: ');
                }
            } catch (err) {
                console.log('Error adding food: ', err);
            }
        }

        addFood();
    }

    function handlePortionDelete(portionId) {
        const deletePortion = async () => {
            try {
                const res = await fetch('http://localhost:54321/delete-portion', {  // delete the portion
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({portionId}),
                    credentials: 'include',
                });

                if (res.ok) {
                    console.log('Succesfully deleted portion');
                    fetchPortionsByDate(selectedDate);  // update the portions
                } else {
                    console.error('Error deleting portion:', res.statusText);
                }
            } catch (err) {
                console.log('Error deleting portion: ', err);
            }
        }

        deletePortion();
    }

    function handleFoodSelect(food) {
        const getFoodData = async () => {
            try {
                const res = await fetch('http://localhost:54321/get-food-data', {  // Get food details
                method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ food }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setFoodData(data);
                } else {
                    console.error('Failed to fetch food data');
                    setFoodData([]);
                }
            } catch (err) {
                console.error('Fetch error: ', err);
                setFoodData([]);
            }
        }

        getFoodData();
    }

    useEffect(() => {   // If there is ever a change in user or the selected date, the portions can change
        if (username) { // If there is a user, get the portions by the selected date
            fetchPortionsByDate(selectedDate);
        } else {    // If there is no user, there can't be any portions
            setPortions([]);
        }}, [username, selectedDate]
    );

    async function fetchPortionsByDate(date) {
        try {
            const res = await fetch('http://localhost:54321/portion/get-portions', {    // Get portions for the date selected
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, date }),
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                
                const formattedData = formatDates(data);    // Format portion dates mmm dd, yyyy hh:mm a
                setPortions(formattedData);     // update portions

                if (data.length === 0) {
                    setSummaryData([]);     // if there is nothing to summarize
                } else {
                    let summary = data.reduce((acc, item) => {      // create the summary values
                        acc.calories += item.calories || 0;
                        acc.carbs += item.carbs || 0;
                        acc.fat += item.fat || 0;
                        acc.protein += item.protein || 0;
                        acc.weight += item.weight || 0;
                        return acc;
                    });

                    summary['date'] = selectedDate;     
                    setSummaryData(summary);    // set the summary date
                }
            } else {
                console.error('Failed to fetch portions');
            }
        } catch (err) {
            console.error('Fetch error: ', err);
        }
    }

    async function fetchFoodsBySearch(query) {
        try {
            const res = await fetch('http://localhost:54321/get-foods', {   // Get all foods matching search
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query }),
            });

            if (res.ok) {   // If able to get foods
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

    return (  // Main app layout
        <div>
            <Header title='Nutrition Tracker' username={username}/>
            {!username ? (      // if not logged in, only show login options
                <AuthBox onLogin={handleLogin} onRegister={handleRegister}/> 
            ) : (   // if logged in, show everything else
                <div>       
                    <LogoutButton onLogout={handleLogout}/>
                    <PortionTable portions={portions} date={selectedDate} onDelete={handlePortionDelete}/>
                    <PortionForm onDateChange={setSelectedDate} onFoodSearchChange={fetchFoodsBySearch} onSubmit={handleAddPortion} onFoodSelect={handleFoodSelect}/>

                    {foodData.length !== 0 ? (  // If a food is selected
                        <FoodData foodData={foodData}/>
                    ) : (<></>)}

                    <FoodForm onSubmit={handleAddFood}/>

                    {summaryData.length !== 0 ? (   // If there are portions for the summary
                        <NutritionSummary summary={summaryData}/>
                    ) : (<></>)}
                </div>
            )}
        
        </div>
    );
}

export default App;
