import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import AddCategory from '../models/AddCategory';
import DeleteCategory from '../models/DeleteCategory';
import DeleteHousing from '../models/DeleteHousing';

const Admin = () => {
    const [categoryVisible, setCategoryVisible] = useState();
    const [categoryDeleteVisible, setCategoryDeleteVisible] = useState();
    const [deleteHousing, setDeleteHousing] = useState();

    return (
        <>
            <Container className='col-4'>
                <Row className='p-2'>
                    <Button onClick={() => setCategoryVisible(true)} variant='dark'>Добавить категорию</Button>
                </Row>
                <Row className='p-2'>
                    <Button onClick={() => setCategoryDeleteVisible(true)} variant='dark'>Удалить категорию</Button>
                </Row>
                <Row className='p-2'>
                    <Button onClick={() => setDeleteHousing(true)} variant='dark'>Удалить объявление</Button>
                </Row>
            </Container>
            <AddCategory show={categoryVisible} hide={() => setCategoryVisible(false)} />
            <DeleteCategory show={categoryDeleteVisible} hide={() => setCategoryDeleteVisible(false)} />
            <DeleteHousing show={deleteHousing} hide={() => setDeleteHousing(false)} />
        </>
    );
}

export default Admin