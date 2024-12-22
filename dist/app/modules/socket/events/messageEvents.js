"use strict";
// import { chatService } from "../../chat/chat.service";
// import { messageService } from "../../message/message.service";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessageEvents = void 0;
// interface IMessageData {
//   chat: string; // Chat ID where the message is being sent
//   sender: string; // Sender ID
//   message: string; // The message content
// }
// export const handleMessageEvents = async (
//   socket: any,
//   data: IMessageData,
//   callback: any,
//   io: any,
// ) => {
//   // console.log("add new message", data);
//   try {
//     const message = await messageService.addMessage(data);
//     if (message) {
//       //   console.log("message", message);
//       const chatRoom = 'new-message::' + data.chat;
//       socket.broadcast.emit(chatRoom, message);
//       //   console.log("message", message);
//       //   console.log(message?.chat?.participants[0].toString());
//       //update the chatlist of the both participants
//       const eventName1 =
//         'update-chatlist::' + message?.chat?.participants[0].toString();
//       const eventName2 =
//         'update-chatlist::' + message?.chat?.participants[1].toString();
//       const chatListforUser1 = await chatService.getChatByParticipantId(
//         { participantId: message?.chat?.participants[0] },
//         { page: 1, limit: 10 },
//       );
//       const chatListforUser2 = await chatService.getChatByParticipantId(
//         { participantId: message?.chat?.participants[1] },
//         { page: 1, limit: 10 },
//       );
//       io.emit(eventName1, chatListforUser1);
//       io.emit(eventName2, chatListforUser2);
//       callback({
//         status: 'Success',
//         message: message.message,
//       });
//       return;
//     } else {
//       return callback({
//         status: 'Error',
//         message: 'Something went wrong',
//       });
//     }
//   } catch (error: any) {
//     console.error('Error adding new message:', error);
//     // logger.error('Error adding new message:', error.message);
//     if (typeof callback === 'function') {
//       callback({ status: 'Error', message: error.message });
//     } else {
//       console.error('Callback is not a function');
//       //   logger.error('Callback is not a function');
//     }
//   }
// };
///.................................///.................................///
const chat_service_1 = require("../../chat/chat.service");
const message_service_1 = require("../../message/message.service");
const mongoose_1 = require("mongoose");
const handleMessageEvents = (socket, data, callback, io) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure chat and sender are valid ObjectIds
        const chatId = new mongoose_1.Types.ObjectId(data.chat); // Convert to ObjectId
        console.log('chatId', chatId);
        const senderId = new mongoose_1.Types.ObjectId(data.sender); // Convert to ObjectId
        console.log('senderId', senderId);
        // Add the message to the database using messageService
        const message = yield message_service_1.messageService.addMessage({
            chat: chatId,
            sender: senderId,
            message: data.message,
            type: 'general', // Set the type of message; you can make this dynamic if needed
        });
        console.log('message', message);
        if (message && message._id) {
            // Populate the chat field to get full chat details including participants
            const populatedMessage = yield message_service_1.messageService
                .getMessageById(message._id);
            console.log('populatedMessage', populatedMessage);
            // Ensure the chat has participants
            if (populatedMessage.chat && populatedMessage.chat.participants) {
                const participants = populatedMessage.chat.participants;
                // // Broadcast the message to the chatroom
                const chatRoom = 'new-message::' + data.chat;
                console.log('chatRoom', chatRoom);
                socket.broadcast.emit(chatRoom, message);
                // Update the chatlist of both participants
                const eventName1 = 'update-chatlist::' + participants[0].toString();
                console.log('eventName1', eventName1);
                const eventName2 = 'update-chatlist::' + participants[1].toString();
                console.log('eventName2', eventName2);
                // Get chat lists for both participants
                const chatListForUser1 = yield chat_service_1.chatService.getChatByParticipantId({ participantId: participants[0] }, { page: 1, limit: 10 });
                console.log('chatListForUser1', chatListForUser1);
                const chatListForUser2 = yield chat_service_1.chatService.getChatByParticipantId({ participantId: participants[1] }, { page: 1, limit: 10 });
                console.log('chatListForUser2', chatListForUser2);
                // Emit updated chat lists to both participants
                io.emit(eventName1, chatListForUser1);
                io.emit(eventName2, chatListForUser2);
                callback({
                    status: 'Success',
                    message: message.message,
                });
            }
            else {
                callback({
                    status: 'Error',
                    message: 'Chat does not have participants.',
                });
            }
        }
        else {
            callback({
                status: 'Error',
                message: 'Failed to create message.',
            });
        }
    }
    catch (error) {
        console.error('Error handling message events:', error);
        callback({
            status: 'Error',
            message: error.message || 'An error occurred',
        });
    }
});
exports.handleMessageEvents = handleMessageEvents;
