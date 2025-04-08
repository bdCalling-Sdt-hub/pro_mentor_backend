import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { mentorRegistrationService } from './mentorRegistration.service';
import AppError from '../../error/AppError';
import config from '../../config';
import { verifyToken } from '../../utils/tokenManage';
// import { generateAvailableTimes } from './mentorRegistration.utils';

const createMentorRegistration = catchAsync(async (req, res) => {
  const token = req.headers?.token as string;

  // console.log('body -1', req.body);

  req.body.preferredDays = JSON.parse(req.body.preferredDays);

  // console.log('token -2', token);

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is required');
  }
  const decodeData = verifyToken({
    token,
    access_secret: config.jwt_access_secret as string,
  });

  if (!decodeData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
  }

  const { userId } = decodeData;

  // console.log('userId -3', userId);

  // console.log('req.files -3', req.files);

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  // Access body and files
  const bodyData = req.body;

  // duplicate check by email  // todo

  // // console.log(files);
  // if (
  //   !files ||
  //   !files['introVideo'] ||
  //   !files['professionalCredential'] ||
  //   !files['additionalDocument']
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Both introvideo and document files are required',
  //   );
  // }

  // const introVideo = files['introVideo'][0];
  // const professionalCredential = files['professionalCredential'];
  // const additionalDocument = files['additionalDocument'];

  // const videoPath = introVideo.path.replace(/^public[\\/]/, '');

  // const professionalCredentialPath = professionalCredential.map((credential) =>
  //   credential.path.replace(/^public[\\/]/, ''),
  // );

  // const additionalDocumentPath = additionalDocument.map((credential) =>
  //   credential.path.replace(/^public[\\/]/, ''),
  // );

  const introVideo = files['introVideo'] ? files['introVideo'][0] : null;
  const professionalCredential = files['professionalCredential'] || [];
  const additionalDocument = files['additionalDocument'] || [];

  // Handle paths for the files if they exist
  const videoPath = introVideo
    ? introVideo.path.replace(/^public[\\/]/, '')
    : null;

  const professionalCredentialPath = professionalCredential.map((credential) =>
    credential.path.replace(/^public[\\/]/, ''),
  );

  const additionalDocumentPath = additionalDocument.map((credential) =>
    credential.path.replace(/^public[\\/]/, ''),
  );

  // console.log({ professionalCredential });
  // console.log({ professionalCredentialPath });


  const availableTimeSlots = `${bodyData.startTime} - ${bodyData.endTime}`; // todo
  // const endBreaktime1 = bodyData.endBreakTime - 1;
  // console.log('endBreaktime1', endBreaktime1);
  // const endBreaktime = parseInt(bodyData.endBreakTime.split(':')[0]) - 1;
  // console.log('endBreaktime', endBreaktime);
  // bodyData.endBreaktime = endBreaktime;

  const payload = {
    ...bodyData,
    mentorId: userId,
    introVideo: videoPath,
    professionalCredential: professionalCredentialPath.length
      ? professionalCredentialPath
      : null,
    additionalDocument: additionalDocumentPath.length
      ? additionalDocumentPath
      : null,
    availableTime: availableTimeSlots,
  };

  console.log('payload payload*****', payload);
  // console.log('............controller............');
  const result =
    await mentorRegistrationService.createMentorRegistrationService(payload); 
  // console.log('result result ', result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration successfully!!',
    data: result,
  });
});

const getallMentorRegistration = catchAsync(async (req, res) => {
  const query = req.query;
  // console.log('query', query);
  let filtersQuery: any = {};

  // if (Object.keys(query).length > 0) {
  //   filtersQuery = Object.entries(query).reduce((acc: any, [key, value]) => {
  //     // Only include key-value pairs where value is not an empty string or an empty array
  //     if (typeof value === 'string' && value.trim() !== '') {
  //       acc[key] = value.trim();
  //     } else if (Array.isArray(value) && value.length > 0) {
  //       // Keep non-empty arrays (e.g., 'industryExpertise')
  //       acc[key] = value;
  //     }
  //     return acc;
  //   }, {});
  // }

  // // console.log('filtersQuery', filtersQuery);

  if (Object.keys(query).length > 0) {
    filtersQuery = Object.entries(query).reduce((acc: any, [key, value]) => {
      // Only process string values
      if (typeof value === 'string') {
        try {
          if (value.startsWith('[') && value.endsWith(']')) {
            const parsedValue = JSON.parse(value.replace(/'/g, '"'));
            if (Array.isArray(parsedValue) && parsedValue.length > 0) {
              acc[key] = parsedValue; 
            }
          } else {
            acc[key] = value;
          }
        } catch (error) {
          console.error('Error parsing array string:', error);
        }
      } else if (Array.isArray(value)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }



  const { meta, result } =
    await mentorRegistrationService.getAllMentorRegistrationQuery(filtersQuery);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'Mentor Registration All are requered successful!!',
  });
});

const getMentorAvailableSlots = catchAsync(async (req, res) => {
  const { mentorId } = req.params;
  const { duration, date } = req.query;
  const payload = {
    mentorId,
    duration,
    date,
  };

  const result =
    await mentorRegistrationService.getMentorAvailableSlots(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Mentor Available Slots are requered successful!!',
  });
});

const getSingleMentorRegistration = catchAsync(async (req, res) => {
  const result =
    await mentorRegistrationService.getSingleMentorRegistrationQuery(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Mentor are requered successful!!',
  });
});

const getAdminMentorRegistration = catchAsync(async (req, res) => {
  const { meta, result } = await mentorRegistrationService.getAdminMentorQuery(
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'Mentor Registration All are requered successful!!',
  });
});

const getMentorRegistrationOnly = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result =
    await mentorRegistrationService.getMentorRegistrationOnly(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'My Registration are requered successful!!',
  });
});

const updateSingleMentorRegistration = catchAsync(async (req, res) => {
 
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const payload = req.body;

  if (payload.preferredDays) {
    try {
      payload.preferredDays = JSON.parse(payload.preferredDays);
    } catch (err) {
      
    }
  }


  if (files && files['introVideo'] && files['introVideo'].length > 0) {
    const introVideo = files['introVideo'][0];
    const videoPath = introVideo.path.replace(/^public[\\/]/, '');
    if (videoPath) {
      payload.introVideo = videoPath;
    }
  } else {
    
  }


  if (files && files['image'] && files['image'].length > 0) {
    const image = files['image'][0];
    const imagePath = image.path.replace(/^public[\\/]/, '');
    if (imagePath) {
      payload.image = imagePath;
    }
  } else {
   
  }

  if (payload.startTime && payload.endTime) {
    payload.availableTime = `${payload.startTime} - ${payload.endTime}`;
  }



  const result = await mentorRegistrationService.updateMentorRegistrationQuery(
    req.params.id,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Updated Single Mentor successfully!',
  });
});

const acceptSingleMentorRegistration = catchAsync(async (req, res) => {
  const result =
    await mentorRegistrationService.acceptSingleMentorRegistrationService(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Updated Single Mentor are successful!!',
  });
});

const cencelSingleMentorRegistration = catchAsync(async (req, res) => {
  const rejone = req.body;
  const result =
    await mentorRegistrationService.cencelSingleMentorRegistrationService(
      req.params.id,
      rejone,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Updated Single Mentor are successful!!',
  });
});

export const mentorRegistrationController = {
  createMentorRegistration,
  getallMentorRegistration,
  getMentorAvailableSlots,
  getMentorRegistrationOnly,
  getAdminMentorRegistration,
  getSingleMentorRegistration,
  updateSingleMentorRegistration,
  acceptSingleMentorRegistration,
  cencelSingleMentorRegistration,
};
