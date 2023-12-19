import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, Button, Overlay } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { login, registration } from '../http/userApi';
import { useContext, useState } from 'react';
import { Context } from '..';
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

const Auth = () => {
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const { user } = useContext(Context)
    const navigate = useNavigate()
    const target = useRef(null);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [show, setShow] = React.useState(false);

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(data);
            user.setIsAuth(true);
            navigate(MAIN_ROUTE);
        } catch (error) {
            if (error.response.status === 500) {
                setShow(true);
            }
        }
    };

    return (
        <>
            <Row style={{ width: '100%', height: '80vh', overflowX: 'hidden' }}>
                <Col className='d-flex flex-column justify-content-center align-items-center'>
                    <h3 style={{ color: 'GrayText' }}>{isLogin ? 'АВТОРИЗАИЯ' : 'РЕГИСТРАЦИЯ'}</h3>
                    <Form className='col-5'>
                        <Form.Group className="mb-2">
                            <Form.Control className="mb-2" id="email" type="email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email" />
                            <Form.Control className="mb-2" id="password" type="password"
                                onChange={e => setPassword(e.target.value)}
                                value={password} placeholder="Password" />
                            <Button onClick={click} className='me-2' ref={target} variant="dark">
                                {isLogin ? 'Войти' : 'Регистрация'}
                            </Button>
                            {isLogin ?
                                <>
                                    <Form.Text className="me-1" style={{ "color": "GrayText" }}>Нет аккаунта?</Form.Text>
                                    <NavLink
                                        className="text-decoration-none"
                                        style={{ color: "brown" }}
                                        to={REGISTRATION_ROUTE}
                                    >
                                        Регистрация
                                    </NavLink>
                                </>
                                :
                                <>
                                    <Form.Text style={{ color: "GrayText" }}
                                        className="me-1"
                                    >
                                        Есть аккаунт?
                                    </Form.Text>
                                    <NavLink
                                        className="text-decoration-none"
                                        style={{ color: "brown" }}
                                        to={LOGIN_ROUTE}
                                    >
                                        Войти
                                    </NavLink>
                                </>
                            }
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Overlay target={target.current} show={show} placement="bottom">
                {({
                    placement: _placement,
                    arrowProps: _arrowProps,
                    show: _show,
                    popper: _popper,
                    hasDoneInitialMeasure: _hasDoneInitialMeasure,
                    ...props
                }) => (
                    <div
                        {...props}
                        style={{
                            position: 'absolute',
                            backgroundColor: 'rgba(255, 100, 100, 0.85)',
                            padding: '2px 10px',
                            color: 'white',
                            borderRadius: 3,
                            ...props.style,
                        }}
                    >
                        Неверный логин или пароль
                    </div>
                )}
            </Overlay>
        </>
    );
}

export default observer(Auth);
