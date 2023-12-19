import React, { useContext, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { Button, Form } from 'react-bootstrap';
import { deleteCategory, getAllCategory } from '../http/categoryApi';
import { Context } from "..";

const DeleteCategory = ({ show = false, hide }) => {
    const { housing } = useContext(Context)
    const [id, setId] = useState()

    useEffect(() => {
        getAllCategory().then(data => housing.setCategory(data))
    }, [housing])

    const deleteFunction = () => {
        deleteCategory( id ).then(data => {
            hide()
        })
    }

    return (
        <>
            <Modal show={show} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Удалить категорию</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Select
                            style={{ cursor: "pointer" }}
                            value={id || ""}
                            onChange={(e) => {setId(e.target.value)}}
                        >
                            <option disabled value="">
                                Выберите категорию
                            </option>
                            {housing.categories.map((e) => (
                                <option
                                    key={e.id}
                                    value={e.id}
                                >
                                    {e.name}
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

export default DeleteCategory 