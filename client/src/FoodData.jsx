import './css/FoodData.module.css';

function FoodData({ foodData }) {
    const tableRows = foodData.map(food => {
        return (
            <tr key={food.foodId}>
                <td>{food.calories.toFixed(1)}</td>
                <td>{food.carbs.toFixed(1)}</td>
                <td>{food.fat.toFixed(1)}</td>
                <td>{food.protein.toFixed(1)}</td>
                <td>{food.weight.toFixed(1)}</td>
            </tr>
        )
    });
            
      

        return (
            <div>
            <h3>Nutritional Values per Portion of {foodData.name}</h3>
                <table id="portionTable">
                    <thead>
                        <tr><th>Calories</th><th>Carbs</th><th>Fat</th>
                        <th>Protein</th><th>Weight</th></tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
}

export default FoodData;