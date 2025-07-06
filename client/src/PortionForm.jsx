import styles from './css/PortionForm.module.css';
import { useState } from 'react';

function PortionForm({ onDateChange, onFoodSearchChange, onSubmit, onFoodSelect }) {
    const [foods, setFoods] = useState([]);

    function handleDateChange(event) {
        event.preventDefault();
        const newDate = event.target.value;
        onDateChange(newDate);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const newPortion = {
            food: event.target.foodSearch.value,
            date: event.target.date.value,
            quantity: event.target.quantity.value
        };

        onSubmit(newPortion);
    }

    async function handleFoodSearchChange(event) {
        event.preventDefault();
        const search = event.target.value;
        const results = await onFoodSearchChange(search);
        setFoods(results);
    }

    function handleFoodSelect(food) {
        document.getElementById('foodSearch').value = food.name;
        setFoods([]);
        onFoodSelect(food.name);
    }

    return (
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