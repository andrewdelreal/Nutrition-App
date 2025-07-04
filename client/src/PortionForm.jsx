import './css/PortionForm.css';
import { useState } from 'react';

function PortionForm({ onDateChange, onFoodSearchChange }) {
    const [foods, setFoods] = useState([]);

    function handleDateChange(event) {
        event.preventDefault();
        const newDate = event.target.value;
        onDateChange(newDate);
    }

    async function handleFoodSearchChange(event) {
        event.preventDefault();
        const search = event.target.value;
        const results = await onFoodSearchChange(search);
        setFoods(results);
    }

    function handleFoodSelect(food) {
        document.getElementById('food-search').value = food.name;
        setFoods([]);
    }

    return (
        <form className="form-inline" id="newPortionForm">
            <div className="form-group">
                <label htmlFor="date">Date & Time</label>
                <input type="datetime-local" onChange={handleDateChange} name="date" id="date" required/>
            </div>

            <div className="form-group">
                <label htmlFor="food-search">Search Food</label>
                <input type="text" onChange={handleFoodSearchChange} id="food-search" name="food-search" autoComplete='off' required/>
                <ul id="suggestions">
                    {foods.map(food => (
                        <li key={food.foodId} onClick={() => handleFoodSelect(food)}>
                            {food.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" min="0.01" required/>
            </div>
        
            <div className="form-group">
                <button type="submit" id="submitButton">Add Portion</button>
            </div>
        </form>
    );
}

export default PortionForm;