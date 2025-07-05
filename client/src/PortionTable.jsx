import './css/PortionTable.module.css';

function PortionTable({ portions, date }) {
    function formatDate(isoString) {
        const date = new Date(isoString);
        let formattedDate = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);

        return formattedDate.substring(0, formattedDate.indexOf(',', 8));
    }

    const tableRows = portions.map(portion => {
        return (
            <tr key={portion.portionId}>
                <td>{portion.date}</td>
                <td>{portion.name}</td>
                <td>{portion.calories.toFixed(1)}</td>
                <td>{portion.carbs.toFixed(1)}</td>
                <td>{portion.fat.toFixed(1)}</td>
                <td>{portion.protein.toFixed(1)}</td>
                <td>{portion.weight.toFixed(1)}</td>
                <td>
                    <button data-portion-id={portion.portionId}>Delete</button>
                </td>
            </tr>
        )
    });

    return (
        <div>
            <h2>Portions for {formatDate(date)}</h2>
            <table id="portionTable">
                <thead>
                    <tr><th>Date</th><th>Name</th><th>Calories</th><th>Carbs</th><th>Fat</th>
                    <th>Protein</th><th>Weight</th><th>Delete</th></tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
    );
}



export default PortionTable;