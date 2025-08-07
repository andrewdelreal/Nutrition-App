import './css/Header.module.css';

type HeaderProps = {
    title: string;
    username: string;
}

function Header({ title, username }: HeaderProps) {
    return (    // header html
        <div>
            <h1>{title}</h1>
            <p>Welcome {username}</p>
        </div>
    );
}

export default Header;
