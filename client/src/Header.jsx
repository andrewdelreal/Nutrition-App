import './css/Header.css';

function Header({ title, username }) {
    return (
        <div>
            <h1>{title}</h1>
            <p>Welcome {username}</p>
        </div>
    );
}

export default Header;