import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { mentorVideoService } from './video.service';
import AppError from '../../error/AppError';


const createMentorVideo = catchAsync(async (req, res) => {
  const { userId } = req.user;
   const files = req.files as { [fieldname: string]: Express.Multer.File[] };

   if (!files || !files['videoUrl'] || !files['thumbnailUrl']) {
     throw new AppError(
       httpStatus.BAD_REQUEST,
       'Both video and thumbnail files are required',
     );
   }

   const videoFile1 = files['videoUrl'][0];
   const thumbnailFile1 = files['thumbnailUrl'][0];
   const videoPath = videoFile1.path.replace(/^public[\\/]/, '');
   const thumbnailPath = thumbnailFile1.path.replace(/^public[\\/]/, '');

  // Construct payload
  const bodyData = {
    ...req.body,
    mentorId: userId,
    videoUrl: videoPath,
    thumbnailUrl: thumbnailPath,
  };
// // console.log('bodyData', bodyData);
  const result = await mentorVideoService.createMentorVideoService(bodyData);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video added successfully!',
    data: result,
  });
});


const getMentorVideoByMentor = catchAsync(async (req, res) => {
  const {userId} = req.user;
  const { meta, result } = await mentorVideoService.getAllMentorVideoByIdQuery(
    req.query,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Video are requered successful!!',
  });
});

const getMentorVideoByRecommended = catchAsync(async (req, res) => {
  const { related }:any = req.query;
  // // console.log('related', related);
  let recommended ;
  if (related) {
    recommended = related;
  }
  const { meta, result } =
    await mentorVideoService.getAllMentorVideoByRecommendedQuery(
      req.query,
      recommended,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All Recommended Video are requered successful!!',
  });
});

const getSingleMentorVideo = catchAsync(async (req, res) => {
  const result =
    await mentorVideoService.getSingleMentorVideoQuery(
      req.params.id,
    );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Video are requered successful!!',
  });
});

const updateSingleMentorVideo = catchAsync(async (req, res) => {
  const { id } = req.params; // Get video ID from the route
  // console.log('id', id);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Initialize updateData with request body
  const updateData: any = { ...req.body };
  // console.log('updateData111', updateData);

  // Check if new video or thumbnail files are provided
  if (files) {
    if (files['videoUrl'] && files['videoUrl'][0]) {
      const videoFile = files['videoUrl'][0];
      updateData.videoUrl = videoFile.path.replace(/^public[\\/]/, '');
    }

    if (files['thumbnailUrl'] && files['thumbnailUrl'][0]) {
      const thumbnailFile = files['thumbnailUrl'][0];
      updateData.thumbnailUrl = thumbnailFile.path.replace(/^public[\\/]/, '');
    }
  }
// console.log('updateData222', updateData);
  // Call the service to update the video
  const result = await mentorVideoService.updateMentorVideoQuery(
    id,
    updateData,
  );

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video updated successfully!',
    data: result,
  });
});


const updateSingleMentorVideoViewUpdated = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await mentorVideoService.updateMentorVideoViewQuery(id);

  // Send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Video view updated successfully!',
    data: result,
  });
});



const deleteSingleMentorVideo = catchAsync(async (req, res) => {
  const result = await mentorVideoService.deletedMentorVideoQuery(
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Video are successful!!',
  });
});




export const mentorVideoController = {
  createMentorVideo,
  getMentorVideoByMentor,
  getMentorVideoByRecommended,
  getSingleMentorVideo,
  updateSingleMentorVideo,
  updateSingleMentorVideoViewUpdated,
  deleteSingleMentorVideo,
};
