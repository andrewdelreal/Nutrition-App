import React from 'react';
import styles from './css/AuthBox.module.css';

type AuthBoxProps = {
    onLogin: (credentials: { username: string; password: string }) => void;
    onRegister: (credentials: { username: string; password: string }) => void;
}

const AuthBox: React.FC<AuthBoxProps> = ({ onLogin, onRegister }) => {
    function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        const credentials = {       // get user and password
            username: event.currentTarget.username.value,
            password: event.currentTarget.password.value
        };

        onLogin(credentials);       // attempt to login

        event.currentTarget.reset();
    } 

    function handleRegister(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const credentials = {       // get user and password
            username: event.currentTarget.newUsername.value,
            password: event.currentTarget.newPassword.value
        };

        onRegister(credentials);    // attempt to login

        event.currentTarget.reset();
    }

    return (
        // AuthBox html
        <div className={styles.card}> 
            <div className="card-body">
                <h5 className={styles.cardTitle}>Login</h5>
                <form onSubmit={handleLogin} id="loginForm">
                    <div className={styles.formGroup}>
                        <label>Username</label>
                        <input type="text" name="username" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" required />
                    </div>
                    <button type="submit">Login</button>
                </form>

                <hr />

                <h5 className={styles.cardTitle}>Register</h5>
                <form onSubmit={handleRegister} id="registerForm">
                    <div className={styles.formGroup}>
                        <label>New Username</label>
                        <input type="text" name="newUsername" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" name="newPassword" required />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AuthBox;
