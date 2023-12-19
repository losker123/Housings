import React, { useContext, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { Button, Form } from 'react-bootstrap';
import { Context } from "..";
import { deleteHousing, getAllHousing } from "../http/housingApi";

const DeleteHousing = ({ show = false, hide }) => {
    const { housing } = useContext(Context)
    const [id, setId] = useState()

    useEffect(() => {
        getAllHousing().then(data => housing.setHousing(data))
    }, [housing])

    const deleteFunction = () => {
        deleteHousing(id).then(data => {
            hide()
        })
    }

    return (
        <>
            <Modal show={show} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить объявление</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Select
                            style={{ cursor: "pointer" }}
                            value={id || ""}
                            onChange={(e) => {setId(e.target.value)}}
                        >
                            <option disabled value="">
                                Выберите объявление  
                            </option>
                            {housing.housing.map((house) => (
                                <option
                                    key={house.id}
                                    value={house.id}
                                >
                                    {house.id}. {house.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={deleteFunction}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteHousing 