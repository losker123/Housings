import React, { useState } from "react"
import { Modal } from "react-bootstrap"
import { Button, Form } from 'react-bootstrap';
import { createCategory } from '../http/categoryApi';

const AddCategory = ({ show = false, hide }) => {
    const [name, setName] = useState()

    const addCategory = () => {
        createCategory({name: name}).then(data => {
            setName('')
            hide()
        })
    }

    return (
        <>
            <Modal show={show} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить категорию</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control className="mb-2" id="categoryId" type="text" value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Название..." />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={addCategory}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddCategory