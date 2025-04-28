import mongoose from 'mongoose';

// Define the schema for the section
const sectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Store the image URL (base64 or URL)
    required: false,
  },
});

// Define the schema for the blog post
const blogPostSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['food', 'fashion', 'travel', 'health-and-wellness', 'beauty', 'other'],
    },
    author: {
      type: String,
      required: true,
    },
    sections: [sectionSchema],
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Create a model from the schema
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
