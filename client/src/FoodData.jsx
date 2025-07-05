import './css/FoodData.module.css';

function FoodData({ foodData }) {
    const tableRow = 
        (
            <tr key={foodData.foodId}>
                <td>{foodData.calories.toFixed(1)}</td>
                <td>{foodData.carbs.toFixed(1)}</td>
                <td>{foodData.fat.toFixed(1)}</td>
                <td>{foodData.protein.toFixed(1)}</td>
                <td>{foodData.weight.toFixed(1)}</td>
            </tr>
        );
    
        return (
            <div>
                <h3>Nutritional Values per Portion of {foodData.name}</h3>
                <table id="portionTable">
                    <thead>
                        <tr><th>Calories</th><th>Carbs</th><th>Fat</th>
                        <th>Protein</th><th>Weight</th></tr>
                    </thead>
                    <tbody>
                        {tableRow}
                    </tbody>
                </table>
            </div>
        );
}

export default FoodData;