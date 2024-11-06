import winston from 'winston';

const logger = winston.createLogger({
	// Set the default logging level to 'info'
	// Logging levels: error < warn < info < verbose < debug < silly
	level: 'info',

	// Configure the log message format using Winston's format combiners
	format: winston.format.combine(
		// Add timestamp to each log entry
		winston.format.timestamp(),

		// Define custom log message format
		// printf allows us to create a custom string format for our logs
		winston.format.printf(({ level, message, timestamp }) => {
			// Return formatted string: [timestamp] level: message
			return `[${timestamp}] ${level}: ${message}`;
		})
	),

	// Define where logs should be output
	transports: [
		// Output logs to console/terminal
		// You can add more transports here (e.g., file transport)
		new winston.transports.Console(),
	],
});

export default logger;
