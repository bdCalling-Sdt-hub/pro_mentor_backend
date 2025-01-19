// import { chatService } from "../../chat/chat.service";
// import { messageService } from "../../message/message.service";

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
//   // // console.log("add new message", data);
//   try {
//     const message = await messageService.addMessage(data);

//     if (message) {
//       //   // console.log("message", message);
//       const chatRoom = 'new-message::' + data.chat;
//       socket.broadcast.emit(chatRoom, message);

//       //   // console.log("message", message);
//       //   // console.log(message?.chat?.participants[0].toString());

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

import { chatService } from '../../chat/chat.service';
import { messageService } from '../../message/message.service';
import { Types } from 'mongoose';

// Define the interface for message data
interface IMessageData {
  chat: Types.ObjectId;
  message?: string;
  type: 'general' | 'special' | 'reply';
  link?: string;
  sender: Types.ObjectId;
}

export const handleMessageEvents = async (
  socket: any,
  data: IMessageData,
  callback: any,
  io: any,
) => {
  try {
    console.log('add-new-message');
    // Ensure chat and sender are valid ObjectIds
    const chatId = new Types.ObjectId(data.chat); // Convert to ObjectId
    // console.log('chatId', chatId);
    const senderId = new Types.ObjectId(data.sender); // Convert to ObjectId
    // console.log('senderId', senderId);

    // Add the message to the database using messageService
    const message = await messageService.addMessage({
      chat: chatId,
      sender: senderId,
      message: data.message,
      type: 'general', // Set the type of message; you can make this dynamic if needed
    });

    // console.log('message', message);

    if (message && message._id) {
      // Populate the chat field to get full chat details including participants
      const populatedMessage: any = await messageService.getMessageById(
        message._id,
      );

      // console.log('populatedMessage', populatedMessage);
      // Ensure the chat has participants
      if (populatedMessage.chat && populatedMessage.chat.participants) {
        const participants = populatedMessage.chat.participants;

        // // Broadcast the message to the chatroom
        const chatRoom = 'new-message::' + data.chat;
        // console.log('chatRoom', chatRoom);
        socket.broadcast.emit(chatRoom, message);

        // Update the chatlist of both participants
        const eventName1 = 'update-chatlist::' + participants[0].toString();
        // console.log('eventName1', eventName1);
        const eventName2 = 'update-chatlist::' + participants[1].toString();
        // console.log('eventName2', eventName2);

        // Get chat lists for both participants
        const chatListForUser1 = await chatService.getChatByParticipantId(
          { participantId: participants[0] },
          { page: 1, limit: 10 },
        );
        // console.log('chatListForUser1', chatListForUser1);
        const chatListForUser2 = await chatService.getChatByParticipantId(
          { participantId: participants[1] },
          { page: 1, limit: 10 },
        );
        // console.log('chatListForUser2', chatListForUser2);
        // Emit updated chat lists to both participants
        io.emit(eventName1, chatListForUser1);
        io.emit(eventName2, chatListForUser2);

        callback({
          status: 'Success',
          message: message.message,
        });
      } else {
        callback({
          status: 'Error',
          message: 'Chat does not have participants.',
        });
      }
    } else {
      callback({
        status: 'Error',
        message: 'Failed to create message.',
      });
    }
  } catch (error: any) {
    console.error('Error handling message events:', error);
    callback({
      status: 'Error',
      message: error.message || 'An error occurred',
    });
  }
};
