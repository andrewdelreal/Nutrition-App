import './css/PortionTable.css';

function PortionTable({ portions }) {
    console.log(portions);
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
        <table id="portionTable">
            <thead>
                <tr><th>Date</th><th>Name</th><th>Calories</th><th>Carbs</th><th>Fat</th>
                <th>Protein</th><th>Weight</th><th>Delete</th></tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    )
}

export default PortionTable;