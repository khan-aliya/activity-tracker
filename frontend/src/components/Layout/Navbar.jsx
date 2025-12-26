import { useAuth } from '../../contexts/AuthContext';
import { Button } from 'react-bootstrap';


const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="/dashboard">
                    Activity Tracker
                </a>
                <div className="d-flex align-items-center">
                    <span className="text-muted me-3">
                        {user?.name || user?.email}
                    </span>
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;