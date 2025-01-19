import { chatService } from "../../chat/chat.service";

interface IChat {
  _id: string; // The type of _id (usually string in MongoDB)
  status: string;
  participants: string[]; // Or adjust according to your actual schema
}

export const handleChatEvents = async (socket:any, data:any, callback:any) => {

  
  console.log('first ', data);
//   console.log('First:', JSON.stringify(data, null, 2)); 
  console.log('socket decodedToken ', socket?.decodedToken);
  // console.log('socket decodedToken userId ', socket?.decodedToken?.userId);
  try {
    // console.log('chat first-1')
    console.log("data",data)
    
    let chat = {};
// console.log('chat first-2');
// console.log('data', data);
console.log('data.participant', data.participant);
const updateData = JSON.parse(data);
console.log({ updateData });
    if (updateData.participant) {
      console.log('chat first-3');
      const existingChat = await chatService.getChatByParticipants(
        socket.decodedToken.userId,
        updateData.participant,
      );
      console.log('existingChat', existingChat);

      if (existingChat && existingChat.status === 'accepted') {
        callback({
          status: 'Success',
          chatId: existingChat._id,
          message: 'Chat already exists',
        });
        return;
      }

      chat = await chatService.createChat(
        socket.decodedToken.userId,
        updateData.participant,
      );
      console.log({ chat });
      //   console.log("chat ", chat);
      //   callback({
      //     status: 'Success',
      //     chatId: chat._id,
      //     message: 'Chat created successfully',
      //   });
      if (chat && (chat as IChat)._id) {
        callback({
          status: 'Success',
          chatId: (chat as IChat)._id, // Type assertion to IChat
          message: 'Chat created successfully',
        });
      } else {
        callback({
          status: 'Error',
          message: 'Failed to create chat',
        });
      }
    } else {
      callback({
        status: 'Error',
        message: 'Must provide at least 2 participants',
      });
    }
  } catch (error:any) {
    console.error('Error adding new chat:', error.message);
    // logger.error('Error adding new chat:', error.message);
    callback({ status: 'Error', message: error.message });
  }
};






// const {
//   addChat,
//   getChatByParticipants,
//   getChatById,
//   getChatByParticipantId,
// } = require('./chat_service');
// const { log } = require('../helper/logger');
// const { addNotification } = require('./notification_service');
// const { addConversaton } = require('./conversation_service');
// const Chat = require('../model/chat');
// const { findById } = require('./user_service');

// const socketIO = ( io: any) => {
//   // io.use((socket, next) => {
//   //   const token = socket.handshake.headers.authorization;
//   //   if (!token) {
//   //     return next(new Error('Authentication error: Token not provided.'));
//   //   }

//   //   // Extract the token from the Authorization header
//   //   const tokenParts = token.split(' ');
//   //   const tokenValue = tokenParts[1];

//   //   // Verify the token
//   //   jwt.verify(tokenValue, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
//   //     if (err) {
//   //       console.error(err);
//   //       return next(new Error('Authentication error: Invalid token.'));
//   //     }
//   //     // Attach the decoded token to the socket object for further use
//   //     socket.decodedToken = decoded;
//   //     next();
//   //   });
//   // });

//   io.on('connection', (socket) => {
//     console.log(`ID: ${socket.id} just connected`);

//     socket.on('request-chat', async (data, callback) => {
//       try {
//         let chat;

//         if (data?.participants?.length >= 2) {
//           chat = await getChatByParticipants(data);

//           if (chat) {
//             callback({
//               status: true,
//               message: 'Chat already exists',
//               data: chat,
//             });
//           }

//           chat = await addChat(data);

//           if (chat) {
//             callback({
//               status: true,
//               message: 'Chat create successful',
//               data: chat,
//             });
//           }

//           console.log(chat);

//           data.participants.forEach(async (participant) => {
//             if (participant.toString() !== data.creator) {
//               const userNotification = {
//                 message: 'Request a new message in ' + data?.name,
//                 receiver: participant,
//                 linkId: chat._id,
//               };
//               const userNewNotification =
//                 await addNotification(userNotification);
//               const roomId = 'user-notification::' + participant.toString();
//               console.log(userNewNotification);
//               io.emit(roomId, userNewNotification);
//             }
//             // const roomID = 'chat-notification::' + participant.toString();
//             // io.emit(roomID, { status: "Success", message: "New chat created", data: null });
//           });

//           return;
//         } else {
//           log('socket error', 'socket');
//           callback({
//             status: 'Error',
//             message: 'Must provide at least 2 participants',
//             data: null,
//           });
//         }
//       } catch (error) {
//         console.error('Error adding new chat:', error.message);
//         callback({ status: 'Error', message: error.message, data: null });
//       }
//     });

//     socket.on('send-message', async (data, callback) => {
//       try {
//         data.messageType = 'message';
//         const conversation = await addConversaton(data);
//         console.log(data.chat);

//         const chat = await getChatById(data.chat);
//         // const sender = await findById(data.sender);

//         chat.participants.forEach(async (participant) => {
//           if (participant.toString() !== data?.sender) {
//             console.log(participant);
//             const eventName = 'receive-message::' + participant.toString();

//             const eventData = {
//               conversation,
//             };
//             io.emit(eventName, eventData);
//           }
//         });

//         console.log(chat);

//         await Chat.updateOne(
//           { _id: data.chat },
//           {
//             $set: {
//               lastMessage: {
//                 sender: data.sender,
//                 message: data.message,
//               },
//             },
//           },
//         );

//         chat.participants.forEach(async (participant) => {
//           const chatListforUser = await getChatByParticipantId({
//             participants: participant,
//           });

//           console.log(chatListforUser);
//           const roomId = 'update-chatlist::' + participant.toString();
//           io.emit(roomId, chatListforUser);
//         });

//         callback({
//           status: 'Success',
//           message: 'Message send successfully',
//           data: data,
//         });
//       } catch (err) {
//         log(err, 'socket');
//         console.error('Error adding new message:', err.message);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`ID: ${socket.id} disconnected`);
//     });
//   });
// };

// module.exports = socketIO;