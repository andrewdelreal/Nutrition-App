import React from 'react';
import './css/Logout.module.css';

type LogoutButtonProps = {
    onLogout: () => void;
}

function LogoutButton({ onLogout }: LogoutButtonProps) {
    function handleLogout(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        onLogout();     // attempt to logout
    }

    return (    // button html
        <button onClick={handleLogout} id="logoutBtn">Logout</button>
    );
}

export default LogoutButton;
