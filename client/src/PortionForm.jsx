import './css/PortionForm.css';

function PortionForm() {
    return (
        <form className="form-inline" id="newPortionForm">
            <div className="form-group">
                <label htmlFor="date">Date & Time</label>
                <input type="datetime-local" name="date" id="date" required/>
            </div>

            <div className="form-group">
                <label htmlFor="food-search">Search Food</label>
                <input type="text" id="food-search" name="food-search" autoComplete='off' required/>
                <ul id="suggestions"></ul>
            </div>

            <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input type="number" id="quantity" name="quantity" min="0.01" required/>
            </div>
        
            <div className="form-group">
                <button type="submit" id="submitButton">Add Portion</button>
            </div>
        </form>
    );
}

export default PortionForm;