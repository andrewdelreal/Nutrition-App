import styles from './css/PortionForm.module.css';
import { useState } from 'react';
import React from 'react';

type PortionFormProps = {
    onDateChange: (date: string) => void;
    onFoodSearchChange: (search: string) => Promise<{ foodId: number; name: string; source: string }[]>;
    onSubmit: (portion: { food: string; date: string; quantity: number; source: string }) => void; // Callback for form submission
    onFoodSelect: (food: { foodId: number; name: string; source: string }) => void; // Callback for food selection
} 

type Food = {
    foodId: number;
    name: string;
    source: string;
};

function PortionForm({ onDateChange, onFoodSearchChange, onSubmit, onFoodSelect }: 
    {onDateChange: PortionFormProps['onDateChange']; onFoodSearchChange: PortionFormProps['onFoodSearchChange']; onSubmit: PortionFormProps['onSubmit']; onFoodSelect: PortionFormProps['onFoodSelect']}) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [foodSource, setFoodSource] = useState('');

    function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const newDate = event.currentTarget.value;
        onDateChange(newDate);      // Notify app of a new date selection
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget.elements;

        const newPortion = {    // create new portion object
            food: (form.namedItem('foodSearch') as HTMLInputElement).value,
            date: (form.namedItem('date') as HTMLInputElement).value,
            quantity: Number((form.namedItem('quantity') as HTMLInputElement).value),
            source: foodSource
        };

        onSubmit(newPortion);   // attempt to add portion
        (form.namedItem('foodSearch') as HTMLInputElement).value = '';
        (form.namedItem('quantity') as HTMLInputElement).value = '';
    }

    async function handleFoodSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        const search = event.currentTarget.value;
        const results = await onFoodSearchChange(search); // get all (10) foods matching search
        setFoods(results);  // set Portion form foodSearch options to the queried results
    }

    function handleFoodSelect(food: Food) {
        (document.getElementById('foodSearch')! as HTMLInputElement).value = food.name;  // If a food is selected from the search list, set the form value
        setFoods([]);   // clear the search list
        setFoodSource(food.source);
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
