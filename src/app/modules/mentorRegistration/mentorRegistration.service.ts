import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.models';
import { TMentorRegistration } from './mentorRegistration.interface';
import { MentorRegistration } from './mentorRegistration.model';
import { userService } from '../user/user.service';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

const createMentorRegistrationService = async (
  payload: TMentorRegistration,
) => {
  try {
    const user = await User.findById(payload.mentorId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found!!');
    }

    console.log({ payload });

    const result = await MentorRegistration.create(payload);

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create mentor registration',
      );
    }

    return result;
  } catch (error) {
    console.error('Error in createMentorRegistrationService:', error);
    throw error; // Rethrow or handle as needed
  }
};

// const getAllMentorRegistrationQuery = async (query: Record<string, unknown>) => {
//   console.log('............1.............');
//   const aggregatePipeline: any = [];
//   const matchConditions: any = {};

//   if (query.searchTerm) {
//     aggregatePipeline.push({
//       $match: { $text: { $search: String(query.searchTerm) } },
//     });
//   }
//  console.log('............2.............');
//   for (const key in query) {
//     if (
//       query.hasOwnProperty(key) &&
//       !['searchTerm', 'sort', 'page', 'limit', 'fields'].includes(key)
//     ) {
//       let value = query[key];

//       if (typeof value === 'string') {
//         if (value.toLowerCase() === 'true') {
//           value = true;
//         } else if (value.toLowerCase() === 'false') {
//           value = false;
//         } else if (!isNaN(Number(value))) {
//           value = Number(value);
//         }
//       }

//       matchConditions[key] = value;
//     }
//   }
//  console.log('............3.............');
//   // Populate categoryId using $lookup
//   aggregatePipeline.push({
//     $lookup: {
//       from: 'users',
//       localField: 'userId',
//       foreignField: '_id',
//       as: 'user',
//     },
//   });

//   // Optional: Unwind the array if you want a single populated document instead of an array
//   aggregatePipeline.push({ $unwind: '$user' });

//   // Apply `matchConditions` and `orConditions` to the pipeline
//   if (Object.keys(matchConditions).length > 0) {
//     aggregatePipeline.push({ $match: matchConditions });
//   }
//  console.log('............4.............');
//   // Sort stage
//   if (typeof query.sort === 'string') {
//     const sortCondition: any = {};
//     query.sort.split(',').forEach((field) => {
//       const direction = field.startsWith('-') ? -1 : 1;
//       const fieldName = field.startsWith('-') ? field.substring(1) : field;
//       sortCondition[fieldName] = direction;
//     });
//     aggregatePipeline.push({ $sort: sortCondition });
//   }

//   // Pagination
//   const page = parseInt(String(query.page), 10) || 1;
//   const limit = parseInt(String(query.limit), 10) || 10;
//   const skip = (page - 1) * limit;
//   aggregatePipeline.push({ $skip: skip }, { $limit: limit });

//   // Project fields
//   if (typeof query.fields === 'string') {
//     const projectFields: any = {};
//     query.fields.split(',').forEach((field) => {
//       projectFields[field] = 1;
//     });
//     aggregatePipeline.push({ $project: projectFields });
//   }

//   const result = await MentorRegistration.aggregate(aggregatePipeline);
//   const metaCountPipeline = [...aggregatePipeline];
//   metaCountPipeline.push({ $count: 'total' } as any);
//   const meta = await MentorRegistration.aggregate(metaCountPipeline);
//   const totalCount = meta[0] ? meta[0].total : 0;

//   return { meta: { total: totalCount, page, limit }, result };
// };

const getAllMentorRegistrationQuery = async (
  query: Record<string, unknown>,
) => {
  console.log('............1.............');
  const aggregatePipeline: any = [];
  const matchConditions: any = {};

  // Check for a search term and add a text search match stage
  if (query.searchTerm) {
    aggregatePipeline.push({
      $match: { $text: { $search: String(query.searchTerm) } },
    });
  }

  console.log('............2.............');
  // Process additional query parameters for filtering
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

  console.log('............3.............');
  // Add the matchConditions to the pipeline if there are any conditions
  if (Object.keys(matchConditions).length > 0) {
    aggregatePipeline.push({ $match: matchConditions });
  }

  // Populate user details using $lookup
  aggregatePipeline.push({
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user',
    },
  });

  // Optional: Unwind the user array to get a single document
  aggregatePipeline.push({
    $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
  });

  console.log('............4.............');
  // Apply sorting if specified
  if (typeof query.sort === 'string') {
    const sortCondition: any = {};
    query.sort.split(',').forEach((field) => {
      const direction = field.startsWith('-') ? -1 : 1;
      const fieldName = field.startsWith('-') ? field.substring(1) : field;
      sortCondition[fieldName] = direction;
    });
    aggregatePipeline.push({ $sort: sortCondition });
  }

  // Pagination setup
  const page = parseInt(String(query.page), 10) || 1;
  const limit = parseInt(String(query.limit), 10) || 10;
  const skip = (page - 1) * limit;
  aggregatePipeline.push({ $skip: skip }, { $limit: limit });

  // Project specific fields if `fields` is specified
  if (typeof query.fields === 'string') {
    const projectFields: any = {};
    query.fields.split(',').forEach((field) => {
      projectFields[field] = 1;
    });
    aggregatePipeline.push({ $project: projectFields });
  }

  // Default case: Add a pipeline to fetch all data if no filters or conditions are provided
  if (
    Object.keys(query).length === 0 || // No query parameters
    (!query.searchTerm && !Object.keys(matchConditions).length) // No filters applied
  ) {
    aggregatePipeline.push({ $match: {} }); // Fetch all data
  }

  // Execute the aggregation pipeline
  const result = await MentorRegistration.aggregate(aggregatePipeline);

  // Meta count for pagination
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
    throw new AppError(404, 'Mentor not found!!');
  }

  return mentorRegistration[0];
};

const getAdminMentorQuery = async (query: Record<string, unknown>) => {
  const mentorRegistrationQuery = new QueryBuilder(
    MentorRegistration.find({}).populate('mentorId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await mentorRegistrationQuery.modelQuery;
  const meta = await mentorRegistrationQuery.countTotal();
  return { meta, result };
};

const getMentorRegistrationOnly = async (id: string) => {
  const mentor = await User.findById(id).populate({
    path: 'mentorRegistrationId',
    populate: { path: 'mentorId' },
  });

  if (!mentor) {
    throw new AppError(404, 'Mentor is Not Found!!');
  }
  if (!mentor?.mentorRegistrationId) {
    throw new AppError(404, 'Mentor Registration is Not Found!!');
  }

  return mentor?.mentorRegistrationId;
};

const updateMentorRegistrationQuery = async (
  id: string,
  payload: Partial<TMentorRegistration>,
) => {
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  const mentorRegistration = await MentorRegistration.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  );

  return mentorRegistration;
};

const acceptSingleMentorRegistrationService = async (id: string) => {
  console.log('id id', id)
  const registerMentor = await MentorRegistration.findById(id);
  if (!registerMentor) {
    throw new AppError(404, 'Register Mentor Not Found!!');
  }
  const mentor = await User.findById(registerMentor.mentorId);
  if (!mentor) {
    throw new AppError(404, 'Mentor Not Found!!');
  }
  const mentorRegistration:any = await MentorRegistration.findByIdAndUpdate(
    id,
    { status: 'accept' },
    { new: true },
  );

  // Update the mentor's registration ID to the updated mentor registration ID
  const updatedMentor = await User.findByIdAndUpdate(
    registerMentor.mentorId,
    { mentorRegistrationId: mentorRegistration._id },
    { new: true },
  );

  return mentorRegistration;
};

const cencelSingleMentorRegistrationService = async (id: string) => {
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
  getMentorRegistrationOnly,
  getAdminMentorQuery,
  getSingleMentorRegistrationQuery,
  updateMentorRegistrationQuery,
  acceptSingleMentorRegistrationService,
  cencelSingleMentorRegistrationService,
  //   getSettings,
};
