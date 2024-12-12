import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
 
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: 'team.robust.dev@gmail.com',
      pass: 'dmvf dwrv jhfc sfpd',
    },
  });


  

  try {
     console.log('mail send started');
    await transporter.sendMail({
      from: 'team.robust.dev@gmail.com', // sender address
      to, // list of receivers
      subject,
      text: '', // plain text body
      html, // html body
    });
    
  } catch (error) {
    console.log('send mail error:', error);
    
  }
  console.log('mail sended stopped');
};



// {
//   _id: "67598a50bbc9d6c263799c9f",
//   menteeId: "6759887fbbc9d6c263799c5c",
//   mentorId: "6753d20d593e9f58f0814b98",
//   subject: "For researching Flower",
//   jobTitle: "Flutter Developer",
//   industryField: "Founder",
//   yearOfExperience: "5 years",
//   educationLevel: "PhD",
//   description: "This is Flower",
//   bookingDate: "2024-12-19T09:00:00.000Z",
//   "bookingTime: "02:45 AM",
//   "duration": 60,
//   "startTime": "02:45 AM",
//   "endTime": "03:44 AM",
//   "status": "Booked",
//   "zoomMeetingId": {
//     "meetingLink": "https://us05web.zoom.us/j/82741095228?pwd=6blutnEIlWUOP3mkN0oGjLYr5xF6a3.1",
//     "startTime": "2024-12-11T12:49:21.000Z",
//     "endTime": "2024-12-11T07:00:20.526Z",
//     "agenda": "Discuss Services"
//   }
// }















