import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOneHousing, getRenters, rentHousing } from "../http/housingApi";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { MAIN_ROUTE } from "../utils/consts";
import { jwtDecode } from "jwt-decode";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReviewModel from "../models/ReviewModel";
import ReviewItem from "../components/ReviewItem";


const HousingPage = () => {
    const { id } = useParams();
    const [housing, setHousing] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renters, setRenters] = useState([]);
    const [reviewModel, setReviewModel] = useState(false)
    const navigate = useNavigate()

    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        getRenters(id).then((data) => setRenters(data))
        getOneHousing(id)
            .then(data => {
                setHousing(data);
            }).finally(() => setIsLoading(false));

    }, [id]);

    const submitRent = async () => {
        const formData = new FormData()
        formData.append('housingId', id)
        formData.append('userId', jwtDecode(localStorage.getItem('token')).id)
        formData.append('startDate', startDate)
        formData.append('endDate', endDate)

        rentHousing(formData).then(() => navigate(MAIN_ROUTE))
    };

    const excludedDates = renters.map((renter) => {
        const start = new Date(renter.startDate.split('T')[0]);
        const end = new Date(renter.endDate.split('T')[0]);
        const dates = [];
        let currentDate = start;

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }).flat();


    return (
        <Container className="mt-2">
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Row>
                    <Col xs={5}>
                        <h4>{housing && housing.name}</h4>
                        <h6>Категория: {housing.category.name}</h6>
                        <h6>Цена за сутки: {housing.price}</h6>
                        <h6>Владелец: {housing.owner.user.email}</h6>
                        <div style={{
                            width: "300px",
                            height: "300px",
                            backgroundImage: `url(${process.env.REACT_APP_API_URL + housing.img})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover'
                        }}>
                        </div>
                        <h6 className="mt-2">Дата бронирования</h6>
                        <Form>
                            <DatePicker
                                selected={startDate}
                                onChange={onChangeDate}
                                startDate={startDate}
                                endDate={endDate}
                                excludeDates={excludedDates}
                                selectsRange
                                selectsDisabledDaysInRange
                                inline
                            />
                        </Form>
                        <Button className="mt-2" variant="dark" onClick={() => submitRent()}>
                            Забронировать

                        </Button>
                    </Col>
                    <Col xs={5} className="ms-2">
                        <YMaps>
                            <Map
                                defaultState={{
                                    center: [housing.coordinate.lat, housing.coordinate.lng],
                                    zoom: 16,
                                }}
                                width={'120%'}
                                height={600}
                            >
                                <Placemark geometry={[housing.coordinate.lat, housing.coordinate.lng]} />
                            </Map>
                        </YMaps>
                        <ReviewItem id={id}/>
                        <Button className="mt-2" variant="dark" onClick={() => setReviewModel(true)}>
                            Добавть отзыв
                        </Button>
                    </Col>
                </Row>
            )
            }
            <ReviewModel show={reviewModel} hide={() => setReviewModel(false)} id={housing && housing.id} />
        </Container >
    );
};

export default HousingPage;