const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: null
        });
    } catch (error) {
        next(error);
    }
};

exports.updateOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate("user");

        if (!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                doc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.createOne = Model => async (req, res, next) => {
    const payload = req.body;
    payload.user = req.user._id;
    try {
        const doc = await Model.create(payload);

        const newDoc = await Model.findOne(doc._id).populate("user")

        res.status(201).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                newDoc
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOne = Model => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id).populate("user");

        if (!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                doc
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getAll = Model => async (req, res, next) => {
    try {
        const features = new APIFeatures(Model.find().sort({createdAt: -1}).populate("user"), req.query)
            .sort()
            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            count: doc.length,
            data: doc
        });

    } catch (error) {
        next(error);
    }
};

exports.likeOne = Model => async(req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        if (doc.likes) {
            doc.likes++;
        } else {
            doc.likes = 1;
        }
        
        const updateDoc = await Model.findByIdAndUpdate(req.params.id, doc, {
            new: true,
            runValidators: true
        }).populate("user");

        if (!updateDoc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                updateDoc
            }
        });

    } catch (error) {
        next(error);
    }
}


exports.dislikeOne = Model => async(req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id);

        if (!doc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        if (doc.dislikes) {
            doc.dislikes++;
        } else {
            doc.dislikes = 1;
        }
        
        const updateDoc = await Model.findByIdAndUpdate(req.params.id, doc, {
            new: true,
            runValidators: true
        }).populate("user");

        if (!updateDoc) {
            return next(new AppError(process.env.HTTP_NOT_FOUND_STATUS_CODE, process.env.ERROR_STATUS, 'No document found with that id'), req, res, next);
        }

        res.status(200).json({
            status: process.env.SUCCESS_STATUS,
            data: {
                updateDoc
            }
        });

    } catch (error) {
        next(error);
    }
}