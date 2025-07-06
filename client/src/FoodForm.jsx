import styles from './css/FoodForm.module.css';

function FoodForm({ onSubmit }) {
    return (
        <div>
        <h3>Add Food</h3>
        
        <form class={styles.formInline} id="newFoodForm">
            <div class={styles.formGroup}>
                <label for="name">Food Name</label>
                <input type="text" id="name" name="name" required/>
            </div>

            <div class={styles.formGroup}>
                <label for="calories">Calories</label>
                <input type="number" id="calories" name="calories" min="0" required/>
            </div>

            <div class={styles.formGroup}>
                <label for="carbs">Carbs</label>
                <input type="number" id="carbs" name="carbs" min="0" required/>
            </div>

            <div class={styles.formGroup}>
                <label for="fat">Fat</label>
                <input type="number" id="fat" name="fat" min="0" required/>
            </div>

            <div class={styles.formGroup}>
                <label for="protein">Protein</label>
                <input type="number" id="protein" name="protein" min="0" required/>
            </div>

            <div class={styles.formGroup}>
                <label for="weight">Weight</label>
                <input type="number" id="weight" name="weight" min="0" required/>
            </div>

            <button type="submit" id="submitButton">Add Food</button>
        </form>
    </div>
    );
}

export default FoodForm;
