import './css/Logout.module.css';

function LogoutButton({ onLogout }) {
    function handleLogout(event) {
        event.preventDefault();

        onLogout();
    }

    return (
        <button onClick={handleLogout} id="logoutBtn">Logout</button>
    );
}

export default LogoutButton;