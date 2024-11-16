import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { mentorRegistrationService } from './mentorRegistration.service';

const createMentorRegistration = catchAsync(async (req, res) => {
 const files = req.files as {
   [fieldname: string]: Express.Multer.File[];
 };

 // Log incoming body and file data for debugging
 console.log('Received body data:', req.body);
 console.log('Received files:', files);

 
 // Access body and files
 const bodyData = req.body;

 // Map files if they exist
 const filesData = {
   introVideo: files['introVideo']?.[0]?.path || '',
   professionalCredential:
     files['professionalCredential']?.map((file) => file.path) || [],
   additionalDocument:
     files['additionalDocument']?.map((file) => file.path) || [],
 };

  console.log('filesData:', filesData);
 // Combine form-data fields with files into the payload
 const payload = {
   ...bodyData,
   ...filesData,
 };
  
  const result =
    await mentorRegistrationService.createMentorRegistrationService(bodyData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration successfully!!',
    data: result,
  });
});


const getMentorRegistration = catchAsync(async (req, res) => {
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
  const result  =
    await mentorRegistrationService.getSingleMentorRegistrationQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Mentor are requered successful!!',
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
  getMentorRegistration,
  getSingleMentorRegistration,
  updateSingleMentorRegistration,
  acceptSingleMentorRegistration,
  cencelSingleMentorRegistration,
  //   updateSetting,
};
