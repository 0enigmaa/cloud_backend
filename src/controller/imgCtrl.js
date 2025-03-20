const cloudinary = require("cloudinary");
const fs = require("fs");
const JWT = require("jsonwebtoken");

const Image = require("../model/imgModel");
cloudinary.config({
    cloud_name: process.env.ClOUD_NAME,
    api_key: process.env.ClOUD_API_KEY,
    api_secret: process.env.ClOUD_API_SECRET,
});
const removeTempFile = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

const imgCtrl = {
    getAllImg: async (req, res) => {
        try {
            const categoryId = req.params;
            const images = await Image.find(categoryId);
            res.status(200).json({ message: "User images", images });
        } catch (error) {
            console.log(error);
            res.status(503).json({ message: error.message });
        }
    },
    getImg: async (req, res) => {
        try {
            const imgId = req.params;
            const image = await Image.find({ imgId });
            res.status(200).json({ message: "User images", image });
        } catch (error) {
            console.log(error);
            res.status(503).json({ message: error.message });
        }
    },

    addImg: async (req, res) => {
        try {
            const token = req.headers.token;
            if (!token) {
                return res.status(401).json({ message: "No token provided!" });
            }
            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            const ownerId = decoded._id;
            const { title, categoryId } = req.body;

            if (!title || !req.files?.photo || !categoryId) {
                return res.status(403).json({ message: "palce fill all fields" });
            }
            const { photo } = req.files;
            const result = await cloudinary.v2.uploader.upload(
                photo.tempFilePath,
                { folder: "OnlineGallery" },
                async (err, data) => {
                    if (err) {
                        throw err;
                    } else {
                        removeTempFile(photo.tempFilePath);
                        return data;
                    }
                }
            );
            const image = { url: result.secure_url, public_id: result.public_id };
            const newImage = await Image.create({
                title,
                imgPath: image,
                ownerId,
                categoryId,
            });
            res.status(201).json({ message: "created photo", image: newImage });
        } catch (error) {
            console.log(error);
            res.status(503).json({ message: error.message });
        }
    },
    deleteImg: async (req, res) => {
        try {
            const token = req.headers.token;
            if (!token) {
                return res.status(401).json({ message: "No token provided!" });
            }
            const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded._id;

            const { id } = req.params;
            const image = await Image.findByIdAndDelete(id);
            if (!image) {
                return res.status(404).json({ message: "Image not found!" });
            }
            if (image.ownerId.toString() !== userId) {
                return res
                    .status(403)
                    .json({ message: "You are not authorized to delete this image!" });
            }
            await cloudinary.v2.uploader.destroy(image.imgPath.public_id);
            res.status(200).json({ message: "Deleted successfully", image });
        } catch (error) {
            console.log(error);
            res.status(503).json({ message: error.message });
        }
    },
};
module.exports = imgCtrl;