import './css/Logout.module.css';

function LogoutButton({ onLogout }) {
    function handleLogout(event) {
        event.preventDefault();

        onLogout();     // attempt to logout
    }

    return (    // button html
        <button onClick={handleLogout} id="logoutBtn">Logout</button>
    );
}

export default LogoutButton;
