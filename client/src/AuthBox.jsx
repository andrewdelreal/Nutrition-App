import './css/AuthBox.css';

function AuthBox({ onLogin, onRegister }) {
    function handleLogin(event) {
        event.preventDefault();
        
        const credentials = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        onLogin(credentials);

        event.target.reset();
    } 

    function handleRegister(event) {
        event.preventDefault();

        const credentials = {
            username: event.target.newUsername.value,
            password: event.target.newPassword.value
        };

        onRegister(credentials);

        event.target.reset();
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Login</h5>
                <form onSubmit={handleLogin} id="loginForm">
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required />
                    </div>
                    <button className="btn btn-primary" type="submit">Login</button>
                </form>

                <hr />

                <h5 className="card-title">Register</h5>
                <form onSubmit={handleRegister} id="registerForm">
                    <div className="form-group">
                        <label>New Username</label>
                        <input type="text" name="newUsername" required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" name="newPassword" required />
                    </div>
                    <button className="btn btn-success" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AuthBox;