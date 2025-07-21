import styles from './css/PortionForm.module.css';
import { useState } from 'react';

function PortionForm({ onDateChange, onFoodSearchChange, onSubmit, onFoodSelect }) {
    const [foods, setFoods] = useState([]);

    function handleDateChange(event) {
        event.preventDefault();
        const newDate = event.target.value;
        onDateChange(newDate);      // Notify app of a new date selection
    }

    function handleSubmit(event) {
        event.preventDefault();

        const newPortion = {    // create new portion object
            food: event.target.foodSearch.value,
            date: event.target.date.value,
            quantity: event.target.quantity.value
        };

        onSubmit(newPortion);   // attempt to add portion
        event.target.foodSearch.value = '';
        event.target.quantity.value = '';
    }

    async function handleFoodSearchChange(event) {
        event.preventDefault();
        const search = event.target.value;
        const results = await onFoodSearchChange(search); // get all (10) foods matching search
        setFoods(results);  // set Portion form foodSearch options to the queried results
    }

    function handleFoodSelect(food) {
        document.getElementById('foodSearch').value = food.name;  // If a food is selected from the search list, set the form value
        setFoods([]);   // clear the search list
        // Also will probably to update the food data;
        // maybe make this a private food variable thing
        onFoodSelect(food);  // send food name to update FoodData
    }

    return (    // Portion Form html
        <form className={styles.formInline} id="newPortionForm" onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="date">Date & Time</label>
                <input type="datetime-local" onChange={handleDateChange} name="date" id="date" required/>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="foodSearch">Search Food</label>
                <input type="text" onChange={handleFoodSearchChange} id="foodSearch" name="foodSearch" autoComplete='off' required/>
                <ul id="suggestions">
                    {foods.map(food => (
                        <li key={food.foodId} onClick={() => handleFoodSelect(food)}>
                            {food.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" min="0.01" step ="0.01" required/>
            </div>
        
            <div className={styles.formGroup}>
                <button type="submit" id="submitButton">Add Portion</button>
            </div>
        </form>
    );
}

export default PortionForm;
