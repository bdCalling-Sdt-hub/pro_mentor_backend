import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.models';
import { TMentorRegistration } from './mentorRegistration.interface';
import { MentorRegistration } from './mentorRegistration.model';
import { userService } from '../user/user.service';
import mongoose from 'mongoose';

const createMentorRegistrationService = async (payload:TMentorRegistration) => {
    console.log('payload', payload);

//     const user = await User.findById(payload.userId);
//     if(!user){
//         throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!!');
//     }
//   const result = await MentorRegistration.create(payload);
//    if (!result) {
//      throw new AppError(
//        httpStatus.BAD_REQUEST,
//        'Failed to Mentor Registration!!',
//      );
//    }

//    process.nextTick(async () => {
//      await userService.updateUser(user._id, {
//        mentorRegistrationId: result._id,
//      });
//    });

//     return result;
 
};


const getAllMentorRegistrationQuery = async (query: Record<string, unknown>) => {
  const aggregatePipeline: any = [];
  const matchConditions: any = {};

  if (query.searchTerm) {
    aggregatePipeline.push({
      $match: { $text: { $search: String(query.searchTerm) } },
    });
  }

  for (const key in query) {
    if (
      query.hasOwnProperty(key) &&
      !['searchTerm', 'sort', 'page', 'limit', 'fields'].includes(key)
    ) {
      let value = query[key];

      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') {
          value = true;
        } else if (value.toLowerCase() === 'false') {
          value = false;
        } else if (!isNaN(Number(value))) {
          value = Number(value); 
        }
      }

      matchConditions[key] = value;
    }
  }

  // Populate categoryId using $lookup
  aggregatePipeline.push({
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  });

  // Optional: Unwind the array if you want a single populated document instead of an array
  aggregatePipeline.push({ $unwind: '$user' });

  // Apply `matchConditions` and `orConditions` to the pipeline
  if (Object.keys(matchConditions).length > 0) {
    aggregatePipeline.push({ $match: matchConditions });
  }

  // Sort stage
  if (typeof query.sort === 'string') {
    const sortCondition: any = {};
    query.sort.split(',').forEach((field) => {
      const direction = field.startsWith('-') ? -1 : 1;
      const fieldName = field.startsWith('-') ? field.substring(1) : field;
      sortCondition[fieldName] = direction;
    });
    aggregatePipeline.push({ $sort: sortCondition });
  }

  // Pagination
  const page = parseInt(String(query.page), 10) || 1;
  const limit = parseInt(String(query.limit), 10) || 10;
  const skip = (page - 1) * limit;
  aggregatePipeline.push({ $skip: skip }, { $limit: limit });

  // Project fields
  if (typeof query.fields === 'string') {
    const projectFields: any = {};
    query.fields.split(',').forEach((field) => {
      projectFields[field] = 1;
    });
    aggregatePipeline.push({ $project: projectFields });
  }

  const result = await MentorRegistration.aggregate(aggregatePipeline);
  const metaCountPipeline = [...aggregatePipeline];
  metaCountPipeline.push({ $count: 'total' } as any);
  const meta = await MentorRegistration.aggregate(metaCountPipeline);
  const totalCount = meta[0] ? meta[0].total : 0;

  return { meta: { total: totalCount, page, limit }, result };
};



const getSingleMentorRegistrationQuery = async (id: string) => {
      const registerMentor = await MentorRegistration.findById(id);
      if (!registerMentor) {
        throw new AppError(404, 'Register Mentor Not Found!!');
      }
  const mentorRegistration = await MentorRegistration.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (mentorRegistration.length === 0) {
    throw new AppError(404, 'Mentor not found!');
  }

  return mentorRegistration[0];
};

const updateMentorRegistrationQuery = async (id: string, payload:Partial<TMentorRegistration>) => {
    const registerMentor = await MentorRegistration.findById(id);
    if (!registerMentor){
        throw new AppError(404, 'Register Mentor Not Found!!');
    }
    const mentorRegistration = await MentorRegistration.findByIdAndUpdate(id, payload, {new:true})
 
  return mentorRegistration;
};

const acceptSingleMentorRegistrationService = async (
  id: string
) => {
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  const mentorRegistration = await MentorRegistration.findByIdAndUpdate(
    id,
    { status: 'accept' },
    { new: true },
  );

  return mentorRegistration;
};

const cencelSingleMentorRegistrationService = async (
  id: string,
) => {
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  const mentorRegistration = await MentorRegistration.findByIdAndUpdate(
    id,
    { status: 'cenceled' },
    { new: true },
  );

  return mentorRegistration;
};



export const mentorRegistrationService = {
  createMentorRegistrationService,
  getAllMentorRegistrationQuery,
  getSingleMentorRegistrationQuery,
  updateMentorRegistrationQuery,
  acceptSingleMentorRegistrationService,
  cencelSingleMentorRegistrationService,
  //   getSettings,
};
