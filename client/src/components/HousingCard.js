import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HOUSING_ROUTE } from "../utils/consts";

const HousingCard = ({ house, onMarkerClick }) => {
    const navigate = useNavigate();

    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mt-3">
            <Card style={{ width: "100%" }}>
                <div style={{ height: "200px", overflow: "hidden" }}>
                    <Card.Img
                        variant="top"
                        src={process.env.REACT_APP_API_URL + house.img}
                        style={{ objectFit: "cover", height: "100%" }}
                    />
                </div>
                <Card.Body>
                    <Card.Title>{house.name}</Card.Title>
                    <Card.Text>{house.price + " р./сут."}</Card.Text>
                    <Button
                        variant="dark"
                        onClick={() => navigate(HOUSING_ROUTE + "/" + house.id)}
                    >
                        Подробнее
                    </Button>
                    <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => onMarkerClick([house.coordinate.lat, house.coordinate.lng])}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 20">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                        </svg>
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default HousingCard;