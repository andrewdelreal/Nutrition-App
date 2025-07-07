import './css/PortionTable.module.css';
import { format } from 'date-fns';

function PortionTable({ portions, date, onDelete }) {
    function formatDate(isoString) {    // Format from iso to readable date
        return format(new Date(isoString), 'MMM dd, yyyy')
    }

    function handleDelete(portionId) {
        onDelete(portionId);    // attempt to delete the portion row
    }

    const tableRows = portions.map(portion => {
        return (    // Create all the portion rows for the portions passed in
            <tr key={portion.portionId}>
                <td>{portion.date}</td>
                <td>{portion.name}</td>
                <td>{portion.calories.toFixed(1)}</td>
                <td>{portion.carbs.toFixed(1)}</td>
                <td>{portion.fat.toFixed(1)}</td>
                <td>{portion.protein.toFixed(1)}</td>
                <td>{portion.weight.toFixed(1)}</td>
                <td>
                    <button onClick={() => handleDelete(portion.portionId)}>Delete</button>
                </td>
            </tr>
        )
    });

    return (    // Portion table html
        <div>
            <h2>Portions for {formatDate(date)}</h2>
            <table id="portionTable">
                <thead>
                    <tr><th>Date</th><th>Name</th><th>Calories</th><th>Carbs (g)</th><th>Fat (g)</th>
                    <th>Protein (g)</th><th>Weight (g)</th><th>Delete</th></tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
    );
}

export default PortionTable;
