import { sendEmail } from "../../utils/mailSender";

export const cancellationRegistrationEmail = async ({
  sentTo,
  subject,
  name,
  rejone,
}: {
  sentTo: string;
  subject: string;
  name: string;
  rejone: string;
}): Promise<void> => {
  await sendEmail(
    sentTo,
    subject,
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
      <h1 style="text-align: center; color: #FF6347;">Registration Cancelled</h1>
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <p style="font-size: 16px; color: #333;">We are sorry to inform you that your registration for the <strong>Pro Mentors Website</strong> has been cancelled. If you did not request this cancellation or believe this to be an error, please contact us immediately.</p>
      <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px;">
        <h3 style="color: #333;">Details of Your Cancellation:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Cancellation Reason:</strong> ${rejone}</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #333; margin-top: 20px;">If you would like to register again or need further assistance, feel free to reach out to us. We are here to help!</p>
      <p style="font-size: 16px; color: #333;">Best regards,</p>
      <p style="font-size: 16px; color: #333;">The <strong>Pro Mentors</strong> Team</p>
    </div>`,
  );
};





export const acceptanceRegistrationEmail = async ({
  sentTo,
  subject,
  name,
}: {
  sentTo: string;
  subject: string;
  name: string;
}): Promise<void> => {
  await sendEmail(
    sentTo,
    subject,
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; background-color: #f9f9f9;">
      <h1 style="text-align: center; color: #4CAF50;">Registration Accepted</h1>
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
      <p style="font-size: 16px; color: #333;">We are happy to inform you that your registration for the <strong>Pro Mentors Website</strong> has been successfully accepted. Congratulations!</p>
      <div style="background-color: #fff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-top: 20px;">
        <h3 style="color: #333;">Details of Your Acceptance:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Status:</strong> Accepted</li>
        </ul>
      </div>
      <p style="font-size: 16px; color: #333; margin-top: 20px;">We are excited to have you onboard! Right now login and explor our app.!!</p>
      <p style="font-size: 16px; color: #333;">Best regards,</p>
      <p style="font-size: 16px; color: #333;">The <strong>Pro Mentors</strong> Team</p>
    </div>`,
  );
};
