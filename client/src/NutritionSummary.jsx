import './css/NutritionSummary.module.css';
import { format } from 'date-fns';

function NutritionSummary({ summary }) {
    function formatDate(isoString) {    // Format from iso to readable date
        return format(new Date(isoString), 'MMM dd, yyyy')
    }

    const summaryRow = (    // Make summary row values
        <tr>
            <td>{summary.calories.toFixed(1)}</td>
            <td>{summary.carbs.toFixed(1)}</td>
            <td>{summary.fat.toFixed(1)}</td>
            <td>{summary.protein.toFixed(1)}</td>
            <td>{summary.weight.toFixed(1)}</td>
        </tr>
    );

    return (    // Nutrition summary html
        <div>
            <h3>{formatDate(summary.date)} Nutritional Summary</h3>
            <table id="summaryTable">
                <thead>
                    <tr><th>Calories</th><th>Carbs (g)</th><th>Fat (g)</th>
                    <th>Protein (g)</th><th>Weight (g)</th></tr>
                </thead>
                <tbody>
                    {summaryRow}
                </tbody>
            </table>
        </div>
    );
}

export default NutritionSummary;
