import React, { useEffect, useState } from "react"
import { Modal, Alert, Spinner, Row, Col } from "react-bootstrap"
import { Button, Form } from 'react-bootstrap';
import { getOneHousing, updateHousing } from "../http/housingApi";
import { observer } from "mobx-react-lite";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const UpdHousingModal = ({ show = false, hide, updId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [housingData, setHousingData] = useState();
    const navigate = useNavigate();

    const [id, setId] = useState();
    const [name, setName] = useState();
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState();
    const [price, setPrice] = useState();
    const [marker, setMarker] = useState(null);
    const [markerName, setMarkerName] = useState();
    const [error, setError] = useState();


    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        if (updId) {
            getOneHousing(updId)
                .then((data) => setHousingData(data))
                .finally(() => setIsLoading(false))
        } 
    }, [updId]);

    const updateFunction = () => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", `${price}`);
        formData.append("categoryId", housingData.categoryId);
        formData.append("img", file);
        formData.append("description", description);
        formData.append("lat", housingData.coordinate.lat);
        formData.append("lng", housingData.coordinate.lng);
        formData.append("markerName", housingData.coordinate.name);
        formData.append("token", localStorage.getItem("token"));

        updateHousing(housingData.id, formData)
            .then((data) => {
                navigate(MAIN_ROUTE);
            })
            .catch((error) => {
                console.error("Error upd housing:", error);
            });
    };

    return (
        <>
            <Modal show={show} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить объявление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {isLoading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <>
                            <Row>
                                <Col xs={10}>
                                    <Form.Group className="mb-3" controlId="">
                                        <Form.Label>Название</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={"name"}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-3" controlId="">
                                        <Form.Label>Фото</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={selectFile}
                                            placeholder="Изменить фото..."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-3" controlId="price">
                                        <Form.Label>Цена за сутки</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Цена за сутки..."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mt-3" controlId="">
                                        <Form.Label>Описание</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Описание..."
                                        />
                                    </Form.Group>
                                    {error && <p className="text-danger">{error}</p>}
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Отмена
                    </Button>
                    <Button variant="warning" onClick={updateFunction}>
                        Изменить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default observer(UpdHousingModal)