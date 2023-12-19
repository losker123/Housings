import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Rating from "react-rating";
import { getAllReviews } from "../http/housingApi";

const ReviewItem = ({ id }) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        getAllReviews(id)
            .then((data) => {
                setReviews(data);
            });
    }, [id]);

    return (
        <>
            <h5>Отзывы</h5>
            {reviews.map((item) => (
                <div key={item.id}>
                    <div className="ms-5 d-flex">
                        <Rating
                            initialRating={item.rating}
                            readonly
                            emptySymbol={<FaRegHeart />}
                            fullSymbol={<FaHeart />}
                        />
                        <h6 style={{ marginLeft: '10px' }}>{item.comment}</h6>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ReviewItem;