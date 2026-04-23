// Database plugin - optional database layer
// Enable by setting config.plugins.database = true

// Example: MongoDB integration (commented out to avoid hard dependency)
//
// import mongoose from 'mongoose';
//
// const connectDB = async (uri) => {
//   try {
//     await mongoose.connect(uri);
//     console.log('✓ MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//   }
// };

export const databasePlugin = {
  name: 'database',
  mount(app, config) {
    console.log('📦 Database plugin loaded (no active connection - set DB_CONFIG to enable)');
  },
  routes() {},
};

export default databasePlugin;
