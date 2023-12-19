import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Form, Col } from "react-bootstrap";
import { Context } from "..";
import { getAllCategory } from "../http/categoryApi";
import { observer } from "mobx-react-lite";
import { Map, YMaps, Placemark } from "@pbe/react-yandex-maps";
import { createHousing } from "../http/housingApi";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const CreateHousing = () => {
    const { housing } = useContext(Context);
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [marker, setMarker] = useState(null);
    const [markerName, setMarkerName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!name || !id || !file || !description || !price) {
            setError("Заполните все поля");
            return;
        }
        if (!marker) {
            setError("Мето на карте не выбрано");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", `${price}`);
        formData.append("categoryId", id);
        formData.append("img", file);
        formData.append("description", description);
        formData.append("lat", marker[0]);
        formData.append("lng", marker[1]);
        formData.append("markerName", markerName);
        formData.append("token", localStorage.getItem("token"));

        createHousing(formData)
            .then((data) => {
                navigate(MAIN_ROUTE);
            })
            .catch((error) => {
                console.error("Error creating housing:", error);
            });
    };

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleMapClick = async (event) => {
        const coordinates = event.get("coords");
        setMarker(coordinates);
        getMarkerName(coordinates);
    };

    const handleMarkerChange = (address) => {
        setMarkerName(address);
    };

    const getMarkerName = (marker) => {
        fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${process.env.REACT_APP_YMAP_KEY}&geocode=${marker[1]},${marker[0]}&format=json`
        )
            .then((response) => response.json())
            .then((data) => {
                const featureMember =
                    data.response.GeoObjectCollection.featureMember;
                const address =
                    featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address
                        .formatted;
                handleMarkerChange(address);
            });
    };

    useEffect(() => {
        getAllCategory().then((data) => housing.setCategory(data));
    }, []);

    return (
        <Container>
            <Row>
                <h2>Создать объявление</h2>
                <Col xs={5}>
                    <Form>
                        <Form.Group className="mb-3" controlId="">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Название..."
                            />
                        </Form.Group>
                        <Form.Select
                            style={{ cursor: "pointer" }}
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        >
                            <option disabled value="">
                                Выберите категорию
                            </option>
                            {housing.categories.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Group className="mt-3" controlId="">
                            <Form.Label>Добавить фото</Form.Label>
                            <Form.Control
                                required
                                type="file"
                                onChange={selectFile}
                                placeholder="Добавить фото..."
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
                    </Form>
                    {error && <p className="text-danger">{error}</p>}
                    <Button className="mt-2" onClick={handleSubmit}>
                        Создать
                    </Button>
                </Col>
                <Col xs={5}>
                    <YMaps>
                        <Map
                            defaultState={{
                                center: [53.895493, 30.335613],
                                zoom: 11,
                            }}
                            width={"120%"}
                            height={500}
                            onClick={handleMapClick}
                        >
                            <Placemark geometry={marker} />
                        </Map>
                    </YMaps>
                </Col>
            </Row>
        </Container>
    );
};

export default observer(CreateHousing);