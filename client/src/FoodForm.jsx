import styles from './css/FoodForm.module.css';

function FoodForm({ onSubmit }) {
    function handleSubmit(event) {
        event.preventDefault();

        const newFood = {   // get new food from form
            name: event.target.name.value,
            calories: event.target.calories.value,
            carbs: event.target.carbs.value,
            fat: event.target.fat.value,
            protein: event.target.protein.value,
            weight: event.target.weight.value
        };

        onSubmit(newFood);      // attempt to add new food
        event.target.reset();
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
