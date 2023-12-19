import React, { useContext, useEffect, useState } from "react"
import { Modal, Alert, Spinner } from "react-bootstrap"
import { Button, Form } from 'react-bootstrap';
import { deleteCategory, getAllCategory } from '../http/categoryApi';
import { Context } from "..";
import { addReview, deleteReview, getOneReview } from "../http/housingApi";
import { jwtDecode } from "jwt-decode";
import Rating from 'react-rating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { observer } from "mobx-react-lite";

const ReviewModel = ({ show = false, hide, id, updId }) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const [reviewData, setReviewData] = useState()

    useEffect(() => {
        if (updId) {
            getOneReview(updId)
                .then((data) => setReviewData(data))
                .catch((error) => setError(error.message))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [updId]);

    const addReviewFunction = () => {
        const formData = new FormData();
        formData.append('userId', jwtDecode(localStorage.getItem('token')).id);
        formData.append('housingId', reviewData ? reviewData.housingId : id);
        formData.append('rating', rating ? rating : reviewData.rating);
        formData.append('comment', comment ? comment : reviewData.comment);

        if (reviewData) {
            deleteReview(reviewData.id)
                .then(() => {
                    addReview(reviewData ? reviewData.housingId : id, formData)
                        .then(() => hide())
                        .catch((error) => setError(error.message));
                })
                .catch((error) => setError(error.message));
        } else {
            addReview(id, formData)
                .then(() => hide())
                .catch((error) => setError(error.message));
        }
    };

    const handleRatingChange = (value) => {
        setRating(value);
    };

    return (
        <>
            <Modal show={show} onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>{updId ? "Изменить отзыв" : "Оставить отзыв"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        {isLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <>
                                <Form.Control
                                    placeholder={reviewData ? reviewData.comment : "Комментарий"}
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="d-flex mt-1">
                                <p className="ms-1">Оценка: </p>
                                <Rating
                                    initialRating={reviewData ? reviewData.rating : rating}
                                    onChange={handleRatingChange}
                                    emptySymbol={<FaRegHeart />}
                                    fullSymbol={<FaHeart />}
                                />
                                </div>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Отмена
                    </Button>
                    {updId ?
                        <Button variant="primary" onClick={addReviewFunction}>
                            Изменить
                        </Button>
                        :
                        <Button variant="primary" onClick={addReviewFunction}>
                            Ок
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default observer(ReviewModel)