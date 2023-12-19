import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import { getAllRentls, getAllUserReviews, getUserHousing } from "../http/userApi";
import Rating from "react-rating";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReviewModel from "../models/ReviewModel";
import { canseleRent, deleteHousing } from "../http/housingApi";
import { observer } from "mobx-react-lite";
import UpdHousingModal from "../models/UpdHousingModal";

const UserProfile = () => {
    const [user, setUser] = useState();
    const [userRentel, setUserRentel] = useState();
    const [userReview, setUserReview] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [userHousing, setUserHousing] = useState()
    const [updateHousingModel, setUpdateHousingModel] = useState()

    const [updateModel, setUpdateModel] = useState(false);
    const [updId, setUpdId] = useState();

    const [key, setKey] = useState(0);

    useEffect(() => {
        setUser(jwtDecode(localStorage.getItem('token')));
    }, []);

    useEffect(() => {
        if (user) {
            getAllRentls(user.id)
                .then((data) => {
                    setUserRentel(data);
                    return getUserHousing(user.id);
                })
                .then((data) => {
                    setUserHousing(data);
                    return getAllUserReviews(user.id);
                })
                .then((data) => {
                    setUserReview(data);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                })
                .finally(() => setIsLoading(false))
        }
    }, [user]);


    const setUpd = (id) => {
        setUpdId(id);
        setUpdateModel(true)
    };

    const updateHousing = (id) => {
        setUpdId(id);
        setUpdateHousingModel(true)
    }

    return (
        <>
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Container>
                    <h4>Профиль пользователя {user.id}</h4>
                    <h6>{user.email}</h6>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Мои бронирования</Accordion.Header>
                            <Accordion.Body>
                                {userRentel.map((item) => (
                                    <Row>
                                        <Col xs={8}>
                                            <p key={item.id}>
                                                {item.housingId} {item.housing.name} {item.housing.coordinate.name}{" "}
                                                Начало: {new Date(item.startDate).toLocaleDateString()}{" "}
                                                Конец: {new Date(item.endDate).toLocaleDateString()}
                                            </p>
                                        </Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => {
                                                canseleRent(item.id)
                                                    .then(() => {
                                                        getAllRentls(user.id).then((data) => {
                                                            setUserRentel(data);
                                                            return getUserHousing(user.id);
                                                        });
                                                    })
                                            }}>
                                                Отменить
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Мои отзывы</Accordion.Header>
                            <Accordion.Body>
                                {userReview.map((item) => (
                                    <Row key={item.id} className="mb-2">
                                        <Col xs={2}>
                                            <Rating
                                                initialRating={item.rating}
                                                readonly
                                                emptySymbol={<FaRegHeart />}
                                                fullSymbol={<FaHeart />}
                                            />
                                        </Col>
                                        <Col xs={6}>
                                            {" "}{item.housing.name}{" "}{item.comment}{" "}
                                            {new Date(item.createdAt).toLocaleDateString()}{" "}
                                        </Col>
                                        <Col xs={2}>
                                            <Button className="btn btn-dark" onClick={() => {
                                                setUpd(item.id)
                                            }}>
                                                Изменить
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Мои объявления</Accordion.Header>
                            <Accordion.Body key={key}>
                                {userHousing.map((item) => (
                                    <Row key={item.id} className="mb-2">
                                        <Col xs={2}>
                                            {item.housing.name}
                                        </Col>
                                        <Col xs={2}>
                                            {item.housing.price}
                                        </Col>
                                        <Col xs={2}>
                                            {item.housing.description}
                                        </Col>
                                        <Col xs={2}>
                                            <div style={{
                                                width: "100px",
                                                height: "100px",
                                                backgroundImage: `url(${process.env.REACT_APP_API_URL + item.housing.img})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover'
                                            }}>
                                            </div>
                                        </Col>
                                        <Col xs={4}>
                                            <Button className="me-2" variant="dark" onClick={() => {
                                                updateHousing(item.housing.id)
                                            }}>
                                                Изменить
                                            </Button>
                                            <Button variant="danger" onClick={() => {
                                                deleteHousing(item.housing.id)
                                                    .then(() => {
                                                        getUserHousing(user.id).then((data) => {
                                                            setUserHousing(data);
                                                            setKey((prevKey) => prevKey + 1);
                                                        });
                                                    })
                                            }}>
                                                Удалить
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <ReviewModel show={updateModel} hide={() => setUpdateModel(false)} updId={updId} />
                    <UpdHousingModal show={updateHousingModel} hide={() => setUpdateHousingModel(false)} updId={updId} />
                </Container>
            )}
        </>
    );
};

export default observer(UserProfile);