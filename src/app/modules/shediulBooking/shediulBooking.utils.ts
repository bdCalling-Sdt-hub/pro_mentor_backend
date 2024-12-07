const axios = require('axios');

const ZOOM_BASE_URL = process.env.ZOOM_BASE_URL;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;



// Function to get OAuth token
async function getZoomAccessToken() {
  const tokenUrl = `${ZOOM_BASE_URL}/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`;
  const auth = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString(
    'base64',
  );

  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error:any) {
    console.error('Error fetching Zoom access token:', error.response.data);
    throw new Error('Failed to retrieve access token');
  }
}

// Utility to format the date and time into ISO 8601 format
function formatDateTime(date:any, time:any) {
  const currentDate = date ? new Date(date) : new Date(); // Use provided date or default to current date

  // Parse time (default to '12:00 PM' if time not provided)
  const [timePart, meridian] = time ? time.split(' ') : ['12:00', 'PM'];
  let [hours, minutes] = timePart.split(':').map(Number);

  // Adjust hours based on AM/PM
  if (meridian.toLowerCase() === 'pm' && hours < 12) {
    hours += 12;
  } else if (meridian.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  // Set the time on the currentDate
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);

  // Return the date in ISO 8601 format
  return currentDate.toISOString();
}



export const generateZoomMeetingLink = async ({
  topic,
  agenda,
  date,
  time,
  duration,
}:any) => {
  try {
    const accessToken = await getZoomAccessToken();

    console.log('accessToken accessToken', accessToken);

    // Format the date and time into ISO 8601
    const startTime = formatDateTime(date, time); // Use default date and time if not provided

    // Create meeting options
    const meetingOptions = {
      topic: topic || 'Online Meeting', // Default topic if none provided
      agenda: agenda || '', // Set the agenda
      type: 2, // Scheduled meeting
      start_time: startTime, // Set the formatted start time
      duration: duration , // Default duration is 60 minutes
      settings: {
        host_video: false, // Do not start with host video on
        participant_video: false, // Do not start with participant video on
        join_before_host: true, // Allow participants to join before host
        enforce_login: false, // Disable login enforcement (optional)
        waiting_room: false, // Disable waiting room so participants can join directly
      },
    };

    // Make a POST request to create the meeting
    const response = await axios.post(
      `${ZOOM_BASE_URL}/v2/users/me/meetings`,
      meetingOptions,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );


    // Calculate meeting end time based on start time and duration
    const endTime = new Date(
      new Date(startTime).getTime() + (duration || 60) * 60000,
    );

    // Return the meeting details
    return {
      meetingLink: response.data.join_url,
      startTime: response.data.start_time,
      endTime: endTime.toISOString(),
      agenda: response.data.agenda,
    };
  } catch (error:any) {
    console.error(
      'Error creating Zoom meeting:',
      error.response ? error.response.data : error.message,
    );
    throw new Error('Failed to create Zoom meeting');
  }
};

// Example usage
// const meetingDetails = await generateZoomMeetingLink({
//   topic: 'Project Meeting',
//   agenda: 'Discuss project milestones',
//   date: '2024-12-08',
//   time: '3:30 PM',
//   duration: 90,
// });

// console.log(meetingDetails);








export default { getZoomAccessToken, formatDateTime };