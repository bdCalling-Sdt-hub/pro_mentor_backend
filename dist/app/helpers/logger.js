"use strict";
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// // Get the current file URL and convert it to a path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const logFilePath = path.join(__dirname, '../../app.log');
// // Ensure the log file exists; if not, create an empty one
// if (!fs.existsSync(logFilePath)) {
//   fs.writeFileSync(logFilePath, '');
// }
// function logMessage(level: any, message: any, errorPath: any) {
//   let logEntry = `${new Date().toISOString()} [${level}] `;
//   // Check if message is an object (typically an Error object)
//   if (typeof message === 'object') {
//     // Extract message and status code from the Error object
//     const errorMessage = message.message || 'Unknown error';
//     const statusCode = message.statusCode || 500;
//     logEntry += `${errorMessage} (Status Code: ${statusCode})`;
//   } else {
//     // If message is not an object, treat it as a regular message
//     logEntry += message;
//   }
//   // Append error path if provided
//   if (errorPath) {
//     logEntry += ` (Error Path: ${
//       typeof errorPath === 'object' ? JSON.stringify(errorPath) : errorPath
//     })`;
//   }
//   logEntry += '\n';
//   try {
//     const existingLogs = fs.readFileSync(logFilePath, 'utf8');
//     fs.writeFileSync(logFilePath, logEntry + existingLogs);
//   } catch (err) {
//     console.error('Error writing to log file:', err);
//   }
// }
// export default {
//   info: (message: any, errorPath: any) =>
//     logMessage('INFO', message, errorPath),
//   error: (message: any, errorPath: any) =>
//     logMessage('ERROR', message, errorPath),
// };
