import './css/NutritionSummary.module.css';

function NutritionSummary({ summary }) {
    function formatDate(isoString) {
        const date = new Date(isoString);
        let formattedDate = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);

        return formattedDate.substring(0, formattedDate.indexOf(',', 8));
    }

    const summaryRow = (
        <tr>
            <td>{summary.calories.toFixed(1)}</td>
            <td>{summary.carbs.toFixed(1)}</td>
            <td>{summary.fat.toFixed(1)}</td>
            <td>{summary.protein.toFixed(1)}</td>
            <td>{summary.weight.toFixed(1)}</td>
        </tr>
    );

    return (
        <div>
            <h3>{formatDate(summary.date)} Nutritional Summary</h3>
            <table id="summaryTable">
                <thead>
                    <tr><th>Calories</th><th>Carbs</th><th>Fat</th>
                    <th>Protein</th><th>Weight</th></tr>
                </thead>
                <tbody>
                    {summaryRow}
                </tbody>
            </table>
        </div>
    );
}

export default NutritionSummary;
