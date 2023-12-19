import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { YMaps } from '@pbe/react-yandex-maps'
import { Map, ObjectManager, ZoomControl } from '@pbe/react-yandex-maps';
import { NavLink } from "react-router-dom";
import { CREATEHOUSING_ROUTE, HOUSING_ROUTE } from "../utils/consts";
import { getAllHousing } from "../http/housingApi";
import { observer } from "mobx-react-lite";
import { getAllCategory } from "../http/categoryApi";
import HousingCard from "../components/HousingCard";

const Main = () => {
    const [housings, setHousings] = useState([]);
    const [objectManagerFeatures, setObjectManagerFeatures] = useState([]);
    const [category, setCategory] = useState([]);

    const [sortBy, setSortBy] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [cityFilter, setCityFilter] = useState("");

    const [mapCenter, setMapCenter] = useState(null);
    const [zoom, setZoom] = useState(null);

    const handleMarkerClick = (coordinates) => {
        setMapCenter(coordinates);
        setZoom(15)
    };

    const resetFilters = () => {
        setSortBy("");
        setCategoryFilter("");
        setSearchQuery("");
        setCityFilter("")
    };

    useEffect(() => {
        setMapCenter(mapCenter || [53.895493, 30.335613]);
    }, [mapCenter]);

    useEffect(() => {
        getAllCategory().then((data) => setCategory(data));

        getAllHousing().then((data) => {
            setHousings(data);
            const newFeatures = data.map((house) => {
                const buttonMarkup = `
          <div style="
              width: 210px;
              height: 150px;
              background-image: url(${process.env.REACT_APP_API_URL + house.img});
              background-repeat: no-repeat;
              background-size: cover;
          ">
          </div>
          <div style="width: 200px">
              <h6>${house.coordinate.name}</h6>
          </div>
          <a href=${HOUSING_ROUTE + '/' + house.id}>Подробнее</a>
        `;
                return {
                    id: house.id,
                    geometry: {
                        type: 'Point',
                        coordinates: [house.coordinate.lat, house.coordinate.lng],
                    },
                    properties: {
                        balloonContent: buttonMarkup,
                    },
                };
            });
            setObjectManagerFeatures(newFeatures);
        });
    }, []);

    const sortData = (data) => {
        if (sortBy === "price_asc") {
            return [...data].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            return [...data].sort((a, b) => b.price - a.price);
        } else {
            return data;
        }
    };

    const filterDataByCategory = (data) => {
        if (categoryFilter) {
            return data.filter((house) => house.category.name === categoryFilter);
        } else {
            return data;
        }
    };

    const searchData = (data) => {
        if (searchQuery || cityFilter) {
            return data.filter((house) =>
                house.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                house.coordinate.name.toLowerCase().includes(cityFilter.toLowerCase())
            );
        } else {
            return data;
        }
    };

    const sortedData = sortData(housings);
    const filteredData = filterDataByCategory(sortedData);
    const searchedData = searchData(filteredData);

    return (
        <Container className="mt-2">
            <Row>
                <Col xs={2} md={3} className="mt-2">
                    <Form>
                        <Form.Label>Сортировать по цене:</Form.Label>
                        <Form.Select
                            style={{ cursor: "pointer" }}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="">Без сортировки</option>
                            <option value="price_asc">По возрастанию</option>
                            <option value="price_desc">По убыванию</option>
                        </Form.Select>
                    </Form>
                    <Form>
                        <Form.Label>Фильтр по категории:</Form.Label>
                        <Form.Select
                            style={{ cursor: "pointer" }}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">Все</option>
                            {category.map((e) => (
                                <option key={e.id} value={e.name}>
                                    {e.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form>
                    <Form>
                        <Form.Label>Поиск по имени:</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form>
                    <Form>
                        <Form.Label>Поиск по городу:</Form.Label>
                        <Form.Control
                            type="text"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </Form>
                    <Form className="mb-2 mt-2">
                        <Button variant="secondary" onClick={() => resetFilters()}>
                            Сбросить
                        </Button>
                    </Form>
                    <NavLink className={"btn btn-dark mb-2"} to={CREATEHOUSING_ROUTE}>
                        Добавить объявление
                    </NavLink>
                </Col>
                <Col xs={9} md={9}>
                    <YMaps>
                        <div>
                            <Map
                                state={{
                                    center: mapCenter || [53.895493, 30.335613],
                                    zoom: zoom || 11,
                                }}
                                width={"85%"}
                                height={300}
                                instanceRef={(ref) => {
                                    if (ref) {
                                        ref.events.add("boundschange", (event) => {
                                            const newCenter = event.get("newCenter");
                                            setMapCenter(newCenter);
                                        });
                                    }
                                }}
                            >
                                <ZoomControl options={{ float: "right" }} />
                                <ObjectManager
                                    options={{
                                        clusterize: true,
                                        gridSize: 32,
                                    }}
                                    objects={{
                                        openBalloonOnClick: true,
                                        preset: "islands#blueDotIcon",
                                    }}
                                    clusters={{
                                        preset: "islands#blueClusterIcons",
                                    }}
                                    defaultFeatures={objectManagerFeatures}
                                    modules={[
                                        "objectManager.addon.objectsBalloon",
                                        "objectManager.addon.objectsHint",
                                    ]}
                                />
                            </Map>
                        </div>
                    </YMaps>
                    <Row>
                        {searchedData.map((house) => (
                            <HousingCard key={house.id} house={house} onMarkerClick={handleMarkerClick} />
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default observer(Main);