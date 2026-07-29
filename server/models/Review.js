const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from reviewing the same course twice
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Static method to get average rating of a course
reviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model("Course").findByIdAndUpdate(courseId, {
      "rating.average": obj[0]?.averageRating || 0,
      "rating.count": obj[0]?.numOfReviews || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.course);
});

// Call getAverageRating before remove
reviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model("Review", reviewSchema);
