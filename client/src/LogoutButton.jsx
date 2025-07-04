import './css/Logout.css';

function LogoutButton({ onLogout }) {
    function handleLogout(event) {
        event.preventDefault();

        onLogout();

        event.target.reset();
    }

    return (
        <button onClick={handleLogout} id="logoutBtn" class="btn btn-secondary">Logout</button>
    );
}

export default LogoutButton;