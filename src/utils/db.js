// // // import mongoose from 'mongoose';

// // // const connectDB = async () => {
// // //   if (mongoose.connections[0].readyState) return;

// // //   try {
// // //     await mongoose.connect(process.env.MONGO_URI);
// // //     console.log('MongoDB Connected');
// // //   } catch (error) {
// // //     console.log('Mongo Error:', error);
// // //   }
// // // };

// // // export default connectDB;


// // import mongoose from 'mongoose';

// // const connectDB = async () => {
// //   try {
// //     if (mongoose.connection.readyState >= 1) {
// //       console.log('✅ Already connected to MongoDB');
// //       return;
// //     }

// //     await mongoose.connect(process.env.MONGO_URI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });

// //     console.log('✅ MongoDB Connected');
// //   } catch (error) {
// //     console.error('❌ MongoDB connection error:', error.message);
// //     process.exit(1); // App ko crash kar do agar DB nahi connect ho raha
// //   }
// // };

// // export default connectDB;

// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     if (mongoose.connection.readyState >= 1) {
//       console.log('✅ Already connected to MongoDB');
//       return;
//     }

//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ MongoDB Connected');
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("✅ Already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'test', // same as in URI
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default connectDB;
