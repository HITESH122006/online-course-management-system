/**
 * ==============================================================================
 * ONLINE COURSE MANAGEMENT SYSTEM - MONGODB CRUD & AGGREGATION SHELL SCRIPTS
 * ==============================================================================
 * Subject: Database Management Systems (TAE-2 Mini Project)
 * Target DB: MongoDB Atlas / mongosh / MongoDB Compass Aggregation Builder
 * ==============================================================================
 */

// Switch / Use the database
// Mongo shell syntax: select/create a database
const db = db.getSiblingDB("online_courses");

// ==============================================================================
// SECTION 1: MONGODB CRUD OPERATIONS
// ==============================================================================

// 1. Insert One Course (insertOne)
// Explanation: Inserts a single course document with schema validation into the 'courses' collection.
db.courses.insertOne({
  title: "Full-Stack Web Development Bootcamp",
  description: "Learn HTML, CSS, JavaScript, React 19, Node.js, and MongoDB from scratch.",
  instructorName: "Dr. Angela Yu",
  category: "Web Development",
  duration: "50 Hours",
  price: 999,
  level: "Beginner",
  rating: 4.8,
  studentsEnrolled: 0,
  createdAt: new Date()
});

// 2. Insert Multiple Courses (insertMany)
// Explanation: Batch inserts multiple course records across various technical domains.
db.courses.insertMany([
  {
    title: "MongoDB Masterclass & Aggregation Pipelines",
    description: "Deep dive into document schemas, indexing, and complex data aggregations.",
    instructorName: "Maximilian Schwarzmüller",
    category: "Database",
    duration: "25 Hours",
    price: 799,
    level: "Intermediate",
    rating: 4.9,
    studentsEnrolled: 0,
    createdAt: new Date()
  },
  {
    title: "Deep Learning & Neural Networks",
    description: "Master PyTorch, Transformers, and GenAI models from mathematical foundations.",
    instructorName: "Prof. Andrew Ng",
    category: "Artificial Intelligence",
    duration: "60 Hours",
    price: 1499,
    level: "Advanced",
    rating: 4.9,
    studentsEnrolled: 0,
    createdAt: new Date()
  },
  {
    title: "AWS Certified Solutions Architect",
    description: "Design highly available and scalable cloud solutions on Amazon Web Services.",
    instructorName: "Maximilian Schwarzmüller",
    category: "Cloud Computing",
    duration: "35 Hours",
    price: 1199,
    level: "Intermediate",
    rating: 4.8,
    studentsEnrolled: 0,
    createdAt: new Date()
  }
]);

// 3. Find All Courses (find)
// Explanation: Retrieves all course documents from the collection.
db.courses.find().pretty();

// 4. Find Courses by Category
// Explanation: Filters courses where the category field matches 'Database'.
db.courses.find({ category: "Database" }).pretty();

// 5. Find Courses with Price Greater than a Value ($gt)
// Explanation: Finds all premium courses priced greater than ₹800.
db.courses.find({ price: { $gt: 800 } }).pretty();

// 6. Find Courses with Price Less than a Value ($lt)
// Explanation: Finds all budget courses priced below ₹900.
db.courses.find({ price: { $lt: 900 } }).pretty();

// 7. Find One Course by Title (findOne)
// Explanation: Retrieves the first document matching the specified course title.
db.courses.findOne({ title: "MongoDB Masterclass & Aggregation Pipelines" });

// 8. Update One Course (updateOne)
// Explanation: Updates the rating and price for a single course document.
db.courses.updateOne(
  { title: "Full-Stack Web Development Bootcamp" },
  { $set: { rating: 4.9, price: 899 } }
);

// 9. Update Many Courses (updateMany)
// Explanation: Adds a promotional discount or flag to all Beginner level courses.
db.courses.updateMany(
  { level: "Beginner" },
  { $set: { isFeatured: true } }
);

// 10. Delete One Course (deleteOne)
// Explanation: Deletes a specific course document from the collection.
db.courses.deleteOne({ title: "AWS Certified Solutions Architect" });

// 11. Delete Many Courses (deleteMany)
// Explanation: Deletes courses matching a condition (e.g. price equals 0).
db.courses.deleteMany({ price: 0 });

// 12. Sort Courses by Price (sort)
// Explanation: Returns all courses sorted in descending order of price (-1 for desc, 1 for asc).
db.courses.find({}, { title: 1, category: 1, price: 1 }).sort({ price: -1 });

// 13. Limit Course Results (limit)
// Explanation: Retrieves only the top 3 highest-priced courses.
db.courses.find({}, { title: 1, price: 1, level: 1 }).sort({ price: -1 }).limit(3);

// 14. Count Documents (countDocuments)
// Explanation: Counts the total number of courses in the 'Database' category.
db.courses.countDocuments({ category: "Database" });


// ==============================================================================
// SECTION 2: MONGODB AGGREGATION COMMANDS
// ==============================================================================

// Query 1: Count courses by category ($group, $sort)
// Explanation: Groups documents by the 'category' field and accumulates total course count.
db.courses.aggregate([
  {
    $group: {
      _id: "$category",
      totalCourses: { $sum: 1 }
    }
  },
  {
    $sort: { totalCourses: -1 }
  }
]);

// Query 2: Calculate average course price by category ($group, $avg, $sort)
// Explanation: Groups by category, computes average price using $avg, and sorts descending.
db.courses.aggregate([
  {
    $group: {
      _id: "$category",
      averagePrice: { $avg: "$price" },
      courseCount: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
]);

// Query 3: Find total number of students enrolled in each course ($project, $sort)
// Explanation: Projects course details and sorts by enrolled students count.
db.courses.aggregate([
  {
    $project: {
      title: 1,
      category: 1,
      studentsEnrolled: 1,
      price: 1
    }
  },
  {
    $sort: { studentsEnrolled: -1 }
  }
]);

// Query 4: Find the most popular courses (studentsEnrolled > 0, limit 5)
// Explanation: Filters courses with enrollments and takes the top 5 most popular.
db.courses.aggregate([
  {
    $match: {
      studentsEnrolled: { $gte: 1 }
    }
  },
  {
    $sort: { studentsEnrolled: -1 }
  },
  {
    $limit: 5
  },
  {
    $project: {
      title: 1,
      instructorName: 1,
      studentsEnrolled: 1,
      rating: 1
    }
  }
]);

// Query 5: Calculate total enrollment count across the system ($group, $sum)
db.enrollments.aggregate([
  {
    $group: {
      _id: null,
      totalEnrollments: { $sum: 1 }
    }
  }
]);

// Query 6: Calculate total revenue from enrollments ($lookup, $unwind, $group)
// Explanation: Performs a relational join between 'enrollments' and 'courses', unwinds the array,
// and computes the sum of course prices.
db.enrollments.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "course",
      foreignField: "_id",
      as: "courseDetails"
    }
  },
  {
    $unwind: "$courseDetails"
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$courseDetails.price" },
      totalEnrollments: { $sum: 1 },
      averageFee: { $avg: "$courseDetails.price" }
    }
  }
]);

// Query 7: Group courses by instructor ($group, $sum, $avg)
// Explanation: Computes total courses taught and average course rating per instructor.
db.courses.aggregate([
  {
    $group: {
      _id: "$instructorName",
      totalCourses: { $sum: 1 },
      avgRating: { $avg: "$rating" }
    }
  },
  {
    $sort: { totalCourses: -1 }
  }
]);

// Query 8: Find overall average course rating ($group, $avg)
db.courses.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" },
      highestRating: { $max: "$rating" },
      lowestRating: { $min: "$rating" }
    }
  }
]);

// Query 9: Sort courses by enrollment count and display revenue potential ($multiply)
db.courses.aggregate([
  {
    $project: {
      title: 1,
      category: 1,
      price: 1,
      studentsEnrolled: 1,
      revenueGenerated: { $multiply: ["$price", "$studentsEnrolled"] }
    }
  },
  {
    $sort: { revenueGenerated: -1 }
  }
]);

// Query 10: Complete Course Statistics Summary ($facet multi-faceted aggregation)
// Explanation: Computes multiple aggregation metrics simultaneously in a single pipeline pass.
db.courses.aggregate([
  {
    $facet: {
      byCategory: [
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ],
      priceStats: [
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            avgPrice: { $avg: "$price" }
          }
        }
      ],
      topCourses: [
        { $sort: { studentsEnrolled: -1 } },
        { $limit: 3 },
        { $project: { title: 1, studentsEnrolled: 1 } }
      ]
    }
  }
]);
