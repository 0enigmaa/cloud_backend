const cloudinary = require("cloudinary")
const { v4 } = require("uuid");
const JWT = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const Category = require("../model/categoryModel")
const Image = require('../model/imgModel')
cloudinary.config({
    cloud_name: process.env.ClOUD_NAME,
    api_key: process.env.ClOUD_API_KEY,
    api_secret: process.env.ClOUD_API_SECRET,
})
const removeTempFile = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}

const categoryCtrl = {
    addCategoty: async (req, res) => {
        console.log(req.files)
        try {
            const token = req.headers.token;
            const { title } = req.body;

            if (!token) {
                return res.status(401).json({ message: "No token provided!" });
            }

            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            const ownerId = decoded._id;

            if (!title || !req.files || !req.files.photo) {
                return res.status(400).json({ message: "Please fill all fields!" });
            }

            const { photo } = req.files;

            const result = await cloudinary.v2.uploader.upload(photo.tempFilePath, {
                folder: "OnlineGallery"
            });

            removeTempFile(photo.tempFilePath);

            const categoryImage = { url: result.secure_url, public_id: result.public_id };

            const newCategory = await Category.create({ title, categoryImage, ownerId });

            return res.status(201).json({ message: "Category created", category: newCategory });

        } catch (error) {
            console.error(error);
            res.status(503).json({ message: error.message, error });
        }


    },


    getAll: async (req, res) => {
        try {
            const token = req.headers.token;

            if (!token) {
                return res.status(401).json({ message: "No token provided!" });
            }

            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            const ownerId = decoded._id;

            let category = await Category.find({ ownerId })
            return res.status(200).send({ message: "all category", category })


        } catch (error) {
            console.log(error);
            res.status(403).send({ message: error.message })
        }
    },
    getOne: async (req, res) => {
        const id = req.params.id

        try {
            let category = await Category.findById(id);
            if (!category) {
                return res.status(404).send({ message: "category not found" })
            }

            return res.status(200).send({ message: "found category", category })
        } catch (error) {
            console.log(error);
            res.status(403).send({ message: error.message })
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { categoryId } = req.params;
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).send({ message: "Kategoriya topilmadi!" });
            }
            const images = await Image.find({ categoryId });
            if (images.length > 0) {
                await Promise.all(
                    images.map(
                        (img) => cloudinary.uploader.destroy(img.public_id)
                    )
                );
                await Image.deleteMany({ categoryId });
            }
            if (category.imagePublicId) {
                await cloudinary.uploader.destroy(category.imagePublicId);
            }
            await Category.findByIdAndDelete(categoryId);
            res
                .status(200)
                .send({ message: "Kategoriya va tegishli rasmlar to‘liq o‘chirildi!" });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Serverda xatolik yuz berdi!" });
        }
    },

}

module.exports = categoryCtrl