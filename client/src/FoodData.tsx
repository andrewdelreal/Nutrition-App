import './css/FoodData.module.css';

type FoodDataRow = {
    foodId: number;
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
    weight: number;
}

function FoodData({ foodData }: { foodData: FoodDataRow }) {
    const tableRow = (       
        //  Get foodData into a table row
        <tr key={foodData.foodId}>
            <td>{foodData.calories.toFixed(1)}</td>
            <td>{foodData.carbs.toFixed(1)}</td>
            <td>{foodData.fat.toFixed(1)}</td>
            <td>{foodData.protein.toFixed(1)}</td>
            <td>{foodData.weight.toFixed(1)}</td>
        </tr>
    );
    
    return (        // FoodData html
        <div>
            <h3>Nutritional Values per Portion of {foodData.name}</h3>
            <table id="portionTable">
                <thead>
                    <tr><th>Calories</th><th>Carbs (g)</th><th>Fat (g)</th>
                    <th>Protein (g)</th><th>Weight (g)</th></tr>
                </thead>
                <tbody>
                    {tableRow}
                </tbody>
            </table>
        </div>
    );
}

export default FoodData;
