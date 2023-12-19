import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { ABOUT_ROUTE, ADMIN_ROUTE, LOGIN_ROUTE, USERPROFILE_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Context } from '..';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MAIN_ROUTE } from '../utils/consts';
import { jwtDecode } from 'jwt-decode';

const NavBar = observer(() => {
    const { user } = useContext(Context)
    const navigate = useNavigate()

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const isAdmin = decodedToken && decodedToken.role === 'ADMIN';

    const logout = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.clear()
        navigate(MAIN_ROUTE)
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink
                    style={{
                        fontStyle: 'italic',
                        fontSize: "19px", color: "wheat", textDecoration: "none"
                    }}
                    to={MAIN_ROUTE}
                >
                    Welcome
                </NavLink>
                {localStorage.getItem('isAuth') ?
                    <Nav className="ml-auto">
                        {isAdmin ?
                            < Button
                                className="me-2"
                                style={{ color: "grey", textDecoration: "none" }}
                                onClick={() => navigate(ADMIN_ROUTE)}
                                variant='outlined-primary'
                            >
                                Админ
                            </Button>
                            :
                            <></>
                        }
                        < Button
                            className="me-2"
                            style={{ color: "grey", textDecoration: "none" }}
                            onClick={() => navigate(USERPROFILE_ROUTE)}
                            variant='outlined-primary'
                        >
                           Профиль 
                        </Button>
                        <Button
                            variant='outlined-primary'
                            style={{ color: "grey", textDecoration: "none" }}
                            onClick={() => logout()}
                        >
                            Выйти
                        </Button>
                    </Nav>
                    :
                    <Nav className="ml-auto">
                        <Button
                            variant='outlined-primary'
                            style={{ color: "grey", textDecoration: "none" }}
                            onClick={() => navigate(LOGIN_ROUTE)}
                        >
                            Авторизация
                        </Button>
                    </Nav>
                }
            </Container>
        </Navbar >
    );
});

export default NavBar;
