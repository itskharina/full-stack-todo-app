import mongoose from 'mongoose';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

logger.info('connecting to DB');

// Attempt to connect to MongoDB using the URI stored in config
mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		// If connection is successful, log a success message
		logger.info('connected to MongoDB');
	})
	// If connection fails, log the error message
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message);
	});

export default mongoose;
