import './css/Logout.css';

function LogoutButton({ onLogout }) {
    function handleLogout(event) {
        event.preventDefault();

        onLogout();
    }

    return (
        <button onClick={handleLogout} id="logoutBtn" className="btn btn-secondary">Logout</button>
    );
}

export default LogoutButton;