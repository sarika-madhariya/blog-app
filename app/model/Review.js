import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    blogId: {
        type: String,
        required: true,
        index: true,
    },
    reviewerId: {
        type: String,
        required: true,
    },
    reviewerName: {
        type: String,
        default: 'Anonymous',
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
