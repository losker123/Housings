const uuid = require('uuid')
const path = require('path');
const { Housing, User, Rental, Category, Coordinates, Owner, Review } = require('../models/models')
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken')
const { Op, where } = require("sequelize");
const { model } = require('../db');

class HousingController {
    async rent(req, res, next) {
        let { housingId, startDate, endDate, userId } = req.body;

        const rent = await Rental.create({ userId, housingId, startDate, endDate });
        return res.json(rent);
    }

    async canseleRent(req, res, next) {
        const { id } = req.params
        await Rental.destroy({ where: { id } });
        return res.json({ message: 'Бронь успешна удалена' })
    }

    async addReview(req, res, next) {
        try {
            const { userId, housingId, rating, comment } = req.body;

            const existingReview = await Review.findAll({
                where: {
                    housingId: housingId,
                }
            });

            if (existingReview.some((review) => review.userId === userId)) {
                return res.status(400).json({ error: 'Отзыв от данного пользователя уже существует' });
            }

            const review = await Review.create({ userId, housingId, rating, comment });
            return res.json(review);
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req, res) {
        const { id } = req.params
        await Review.destroy({ where: { id } })
        return res.json({ message: 'del' })
    }

    async create(req, res, next) {
        try {
            let { name, price, categoryId, description, lat, lng, markerName, token } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const housing = await Housing.create({ name, price, categoryId, description, img: fileName })

            const id = housing.id;
            const coords = await Coordinates.create({ name: markerName, lat, lng, housingId: id });

            const userId = jwt.decode(token).id
            const owner = await Owner.create({ housingId: id, userId: userId })

            return res.json(housing)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const { name, price, categoryId, description, lat, lng, markerName, token } = req.body;
            const { id } = req.params
            const { img } = req.files;

            const housing = await Housing.findOne({ where: { id } });
            if (!housing) {
                throw new Error("Объявление не найдено");
            }

            housing.name = name;
            housing.price = price;
            housing.categoryId = categoryId;
            housing.description = description;

            if (img) {
                const fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, "..", "static", fileName));
                housing.img = fileName;
            }

            await housing.save();

            const coords = await Coordinates.findOne({ where: { housingId: id } });
            if (!coords) {
                throw new Error("Координаты не найдены");
            }

            coords.name = markerName;
            coords.lat = lat;
            coords.lng = lng;

            await coords.save();

            const userId = jwt.decode(token).id;
            const owner = await Owner.findOne({ where: { housingId: id, userId: userId } });
            if (!owner) {
                throw new Error("Владелец не найден");
            }

            owner.userId = userId;

            await owner.save();

            return res.json(housing);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        try {
            const hosting = await Housing.findAll({
                include: [
                    { model: Category, as: 'category' },
                    { model: Coordinates, as: 'coordinate' },
                    { model: Owner, as: 'owner' }
                ]
            });
            return res.json(hosting);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to get housing data' });
        }
    }

    async getOne(req, res) {
        const { id } = req.params
        const hosting = await Housing.findOne(
            {
                where: { id },
                include: [
                    { model: Category, as: 'category' },
                    { model: Coordinates, as: 'coordinate' },
                    { model: Owner, as: 'owner', include: [{ model: User, as: 'user' }] },
                ]
            },
        )
        return res.json(hosting)
    }

    async getReview(req, res) {
        const { id } = req.params
        const reviews = await Review.findAll(
            {
                where: { housingId: id },
            },
        )
        return res.json(reviews)
    }

    async getOneReview(req, res) {
        const { id } = req.params
        const review = await Review.findOne({ where: { id: id } })
        return res.json(review)
    }

    async getRenters(req, res) {
        const { id } = req.params
        const renter = await Rental.findAll(
            {
                where: { housingId: id },
            },
        )
        return res.json(renter)
    }

    async deleteHouing(req, res) {
        const { id } = req.params
        await Owner.destroy({ where: { housingId: id } })
        await Housing.destroy({ where: { id } })
        return res.json({ message: 'Объявление успешно удалено' })
    }
}

module.exports = new HousingController()