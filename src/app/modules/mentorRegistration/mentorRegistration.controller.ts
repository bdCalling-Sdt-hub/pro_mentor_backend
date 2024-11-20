import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { mentorRegistrationService } from './mentorRegistration.service';
import AppError from '../../error/AppError';
import { generateAvailableTimes } from './mentorRegistration.utils';

const createMentorRegistration = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  // Access body and files
  const bodyData = req.body;
  if (
    !files ||
    !files['introVideo'] ||
    !files['professionalCredential'] ||
    !files['additionalDocument']
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Both introvideo and document files are required',
    );
  }

  const introVideo = files['introVideo'][0];
  const professionalCredential = files['professionalCredential'][0];
  const additionalDocument = files['additionalDocument'][0];
  const videoPath = introVideo.path.replace(/^public[\\/]/, '');
  const professionalCredentialPath = professionalCredential.path.replace(
    /^public[\\/]/,
    '',
  );
  const additionalDocumentPath = additionalDocument.path.replace(
    /^public[\\/]/,
    '',
  );

  // const startTime = bodyData.startTime;
  const incrementTime = 15;

  const availableTimeSlots = generateAvailableTimes(
    bodyData.startTime,
    bodyData.endTime,
    incrementTime,
  );
  // console.log(availableTimeSlots);

  const payload = {
    ...bodyData,
    mentorId: userId,
    introVideo: videoPath,
    professionalCredential: professionalCredentialPath,
    additionalDocument: additionalDocumentPath,
    availableTime: availableTimeSlots,
  };

  // console.log('payload payload', payload);

  const result =
    await mentorRegistrationService.createMentorRegistrationService(payload);
    console.log('result', result);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration successfully!!',
    data: result,
  });
});


const getallMentorRegistration = catchAsync(async (req, res) => {
  const { meta, result } =
    await mentorRegistrationService.getAllMentorRegistrationQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: 'Mentor Registration All are requered successful!!',
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
  const {userId} = req.user;
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
  const result = await mentorRegistrationService.updateMentorRegistrationQuery(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Updated Single Mentor are successful!!',
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
  const result =
    await mentorRegistrationService.cencelSingleMentorRegistrationService(
      req.params.id,
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
  getMentorRegistrationOnly,
  getAdminMentorRegistration,
  getSingleMentorRegistration,
  updateSingleMentorRegistration,
  acceptSingleMentorRegistration,
  cencelSingleMentorRegistration,
};
