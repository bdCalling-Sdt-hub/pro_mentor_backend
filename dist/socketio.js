'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const config_1 = __importDefault(require('./app/config'));
const chatEvents_1 = require('./app/modules/socket/events/chatEvents');
const messageEvents_1 = require('./app/modules/socket/events/messageEvents');
const socketVerifyToken_1 = require('./app/helpers/socketVerifyToken');
const socketIO = (io) => {
  // Initialize an object to store the active users
  let activeUsers = {};
  // Middleware to handle JWT authentication
  io.use((socket, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const token = socket.handshake.headers.authorization;
      if (!token) {
        return next(new Error('Authentication error: Token not provided.'));
      }
      const tokenParts = token.split(' ');
      const tokenValue = tokenParts[1];
      try {
        // Verify token using the utility function
        const decoded = yield (0, socketVerifyToken_1.socketVerifyToken)(
          tokenValue,
          config_1.default.jwt_access_secret,
        ); // Ensures secret is a string
        socket.decodedToken = decoded;
        next();
      } catch (err) {
        console.error('JWT Verification Error:', err);
        return next(new Error('Authentication error: Invalid token.'));
      }
    }),
  );
  // On new socket connection
  io.on('connection', (socket) => {
    var _a;
    console.log('connected');
    // console.log('socket decodedToken', socket.decodedToken);
    try {
      // socket.on('message', (data, callback) => {
      //   console.log('Data message:', data); // Log the incoming message
      //   // Optionally call the callback to acknowledge receipt
      //   if (callback) {
      //     callback({
      //       status: 'received',
      //       message: 'Message received successfully',
      //     });
      //   }
      //   // Emit a message back to the client or other clients
      //   socket.emit('message', { data: data }); // Emitting the message back
      // });
      // console.log('activeUsers top', activeUsers);
      if (
        !((_a =
          socket === null || socket === void 0
            ? void 0
            : socket.decodedToken) === null || _a === void 0
          ? void 0
          : _a.userId)
      ) {
        console.error('No user ID in decoded token');
        return;
      }
      if (!activeUsers[socket.decodedToken.userId]) {
        activeUsers[socket.decodedToken.userId] = Object.assign(
          Object.assign({}, socket.decodedToken),
          { id: socket.decodedToken.userId },
        );
        // console.log(`User Id: ${socket.decodedToken.userId} has connected.`);
      } else {
        console.log(
          `User Id: ${socket.decodedToken.userId} is already connected.`,
        );
      }
      // console.log('activeUsers down', activeUsers);
      // Handle 'add-new-chat' event
      socket.on('add-new-chat', (data, callback) =>
        (0, chatEvents_1.handleChatEvents)(socket, data, callback),
      );
      // Handle other events, like 'add-new-message'
      socket.on('add-new-message', (data, callback) =>
        (0, messageEvents_1.handleMessageEvents)(socket, data, callback, io),
      );
      // Other socket events...
    } catch (error) {
      console.error('Error in socket connection:', error);
    }
  });
};
exports.default = socketIO;
