import React from 'react';
import styles from './css/FoodForm.module.css';

type FoodFormProps = {
    onSubmit: (newFood: {
        name: string;
        calories: number;
        carbs: number;
        fat: number;
        protein: number;
        weight: number;
    }) => void;
}

function FoodForm({ onSubmit }: { onSubmit: FoodFormProps['onSubmit'] }) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget.elements;

        const newFood = {   // get new food from form
            name: (form.namedItem('name') as HTMLInputElement).value,
            calories: Number((form.namedItem('calories') as HTMLInputElement).value),
            carbs: Number((form.namedItem('carbs') as HTMLInputElement).value),
            fat: Number((form.namedItem('fat') as HTMLInputElement).value),
            protein: Number((form.namedItem('protein') as HTMLInputElement).value),
            weight: Number((form.namedItem('weight') as HTMLInputElement).value),
        };

        onSubmit(newFood);      // attempt to add new food
        event.currentTarget.reset();
    }

    return (    // Food form html
        <div>
            <h3>Add Food</h3>
        
            <form className={styles.formInline} id="newFoodForm" onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Food Name</label>
                    <input type="text" id="name" name="name" required/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="calories">Calories</label>
                    <input type="number" id="calories" name="calories" min="0" required/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="carbs">Carbs (g)</label>
                    <input type="number" id="carbs" name="carbs" min="0" required/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="fat">Fat (g)</label>
                    <input type="number" id="fat" name="fat" min="0" required/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="protein">Protein (g)</label>
                    <input type="number" id="protein" name="protein" min="0" required/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="weight">Weight (g)</label>
                    <input type="number" id="weight" name="weight" min="0" required/>
                </div>

                <button type="submit" id="submitButton">Add Food</button>
            </form>
        </div>
    );
}

export default FoodForm;
