import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.models';
import { TMentorRegistration } from './mentorRegistration.interface';
import { MentorRegistration } from './mentorRegistration.model';
import { userService } from '../user/user.service';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { walletService } from '../wallet/wallet.service';
import { isTimeOverlap } from './mentorRegistration.utils';

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


// Helper function to convert time to minutes
const convertToMinutes = (time: string): number => {
  console.log('time convert', time);
  const [hourMinute, period] = time.split(' '); // Split into hour-minute and AM/PM
  let [hours, minutes] = hourMinute.split(':').map(Number); // Get hours and minutes
  if (period === 'PM' && hours !== 12) {
    hours += 12; // Convert PM times to 24-hour format
  }
  if (period === 'AM' && hours === 12) {
    hours = 0; // Convert 12 AM to 00 hours
  }
  return hours * 60 + minutes; // Return time in minutes
};

// Function to get all mentor registrations based on query parameters
// const getAllMentorRegistrationQuery = async (
//   query: Record<string, unknown>,
// ) => {
//   console.log('query', query);
//   // Destructure the query parameters
//   const { availableTime, searchTerm, sort, page, limit, ...filters }: any =
//     query;

//   // Initialize the base query conditions
//   let queryConditions: Record<string, any> = {};
//   console.log('queryConditions 1', queryConditions);

 
//   // Build the search filters
//   if (searchTerm) {
//     queryConditions.$text = { $search: String(searchTerm) };
//   }
//   console.log('queryConditions 2', queryConditions);

//   // Add other filters to the query
//   if (filters) {
//     for (const [key, value] of Object.entries(filters)) {
//       queryConditions[key] = value;
//     }
//   }

//   console.log('queryConditions 3', queryConditions);

//   // Query the database to fetch all mentor registrations that match the conditions
//   let mentorRegistrations = await MentorRegistration.find(queryConditions)
//     .populate('mentorId') // Assuming `mentorId` is a reference to the User model
//     // .sort('-reviewCount')
//     .exec();

//   // Now, filter the mentor registrations based on availableTime overlap
  
//   // Apply sorting if specified
//   // Apply sorting if specified
//   if (sort) {
//     console.log('sort', sort);
//     const sortFields = sort
//       .split(',')
//       .reduce((acc: Record<string, number>, field: string) => {
//         const direction = field.startsWith('-') ? -1 : 1;
//         const fieldName = field.startsWith('-') ? field.substring(1) : field;
//         acc[fieldName] = direction;
//         return acc;
//       }, {});

//     console.log('sortFields', sortFields);
    
//     // Apply sorting at the database level instead of in-memory sorting
//     mentorRegistrations = await MentorRegistration.find(queryConditions)
//       .populate('mentorId')
//       .sort(sortFields) // MongoDB sort operator
//       .exec();
//   }

//   // Pagination setup
//   const pageNumber = parseInt(String(page), 10) || 1;
//   const limitNumber = parseInt(String(limit), 10) || 10;
//   const skip = (pageNumber - 1) * limitNumber;

//   // Slice the results for pagination
//   const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);

//   // Return the paginated result along with meta data
//   return {
//     meta: {
//       total: mentorRegistrations.length,
//       page: pageNumber,
//       limit: limitNumber,
//     },
//     result: paginatedResults,
//   };
// };



const getAllMentorRegistrationQuery = async (
  query: Record<string, unknown>,
) => {
  console.log('query', query);
  // Destructure the query parameters
  const { availableTime, searchTerm, sort, page, limit, ...filters }: any =
    query;

  // Extract query times
  let queryStart = '';
  let queryEnd = '';
  if (availableTime) {
    const [queryTimeStart, queryTimeEnd] = availableTime.split(' - ');
    queryStart = queryTimeStart;
    queryEnd = queryTimeEnd;
  }

  // Initialize the base query conditions
  let queryConditions: Record<string, any> = {};
  console.log('queryConditions 1', queryConditions);

  // Build the search filters
  if (searchTerm) {
    queryConditions.$text = { $search: String(searchTerm) };
  }
  console.log('queryConditions 2', queryConditions);

  // Add other filters to the query
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      queryConditions[key] = value;
    }
  }

  console.log('queryConditions 3', queryConditions);

  // Query the database to fetch all mentor registrations that match the conditions
  let mentorRegistrations = await MentorRegistration.find(queryConditions)
    .populate('mentorId')
    .sort('-reviewCount')
    .exec();

  // Now, filter the mentor registrations based on availableTime overlap
  if (queryStart && queryEnd) {
    mentorRegistrations = mentorRegistrations.filter((mentor: any) => {
      // Ensure availableTime is defined before attempting to split it
      if (!mentor.availableTime) return false; // Skip mentors with undefined or empty availableTime

      const [mentorStart, mentorEnd] = mentor.availableTime.split(' - ');

      // Ensure mentorStart and mentorEnd are valid
      if (!mentorStart || !mentorEnd) return false;

      return isTimeOverlap(mentorStart, mentorEnd, queryStart, queryEnd);
    });
  }

  // Apply sorting if specified
  if (sort) {
    console.log('sort', sort);
    const sortFields = sort
      .split(',')
      .reduce((acc: Record<string, number>, field: string) => {
        const direction = field.startsWith('-') ? -1 : 1;
        const fieldName = field.startsWith('-') ? field.substring(1) : field;
        acc[fieldName] = direction;
        return acc;
      }, {});

    console.log('sortFields', sortFields);

    // Apply sorting at the database level instead of in-memory sorting
    mentorRegistrations = await MentorRegistration.find(queryConditions)
      .populate('mentorId')
      .sort(sortFields)
      .exec();
  }

  // Pagination setup
  const pageNumber = parseInt(String(page), 10) || 1;
  const limitNumber = parseInt(String(limit), 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  // Slice the results for pagination
  const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);

  // Return the paginated result along with meta data
  return {
    meta: {
      total: mentorRegistrations.length,
      page: pageNumber,
      limit: limitNumber,
    },
    result: paginatedResults,
  };
};





// const getAllMentorRegistrationQuery = async (
//   query: Record<string, unknown>,
// ) => {
//   console.log('query', query);
//   // Destructure the query parameters
//   const { availableTime, searchTerm, sort, page, limit, ...filters }: any =
//     query;

//   // Initialize the base query conditions
//   let queryConditions: Record<string, any> = {};
//   console.log('queryConditions 1', queryConditions);

//   // If availableTime is provided, convert it into start and end times (in minutes)
//   let startTimeQuery: string | undefined = undefined;
//   let endTimeQuery: string | undefined = undefined;
//   if (availableTime && typeof availableTime === 'string') {
//     [startTimeQuery, endTimeQuery] = availableTime.split(' - ');
//   }

//   console.log('startTimeQuery', startTimeQuery);
//   console.log('endTimeQuery', endTimeQuery);

//   // Convert the query times into minutes
//   let queryStartTime: number | undefined = undefined;
//   let queryEndTime: number | undefined = undefined;

//   if (startTimeQuery && endTimeQuery) {
//     queryStartTime = convertToMinutes(startTimeQuery);
//     queryEndTime = convertToMinutes(endTimeQuery);
//   }

//   console.log('queryStartTime', queryStartTime);
//   console.log('queryEndTime', queryEndTime);

//   // Build the search filters
//   if (searchTerm) {
//     queryConditions.$text = { $search: String(searchTerm) };
//   }
//   console.log('queryConditions 2', queryConditions);

//   // Add other filters to the query
//   if (filters) {
//     for (const [key, value] of Object.entries(filters)) {
//       queryConditions[key] = value;
//     }
//   }

//   console.log('queryConditions 3', queryConditions);

//   // Query the database to fetch all mentor registrations that match the conditions
//   let mentorRegistrations = await MentorRegistration.find(queryConditions)
//     .populate('mentorId') // Assuming `mentorId` is a reference to the User model
//     // .sort('-reviewCount')
//     .exec();

//   // Now, filter the mentor registrations based on availableTime overlap
//   if (queryStartTime && queryEndTime) {
//     mentorRegistrations = mentorRegistrations.filter((registration: any) => {
//       // Check if the registration has availableTime before trying to split it
//       if (!registration.availableTime) {
//         return false; // Skip this registration if availableTime is not defined
//       }

//       // Split mentor's available time into start and end time
//       const [mentorStart, mentorEnd] =
//         registration?.availableTime?.split(' - ') || [];

//       // If mentor's availableTime is malformed or missing, skip this registration
//       if (!mentorStart || !mentorEnd) {
//         return false; // Skip if we can't properly split the availableTime
//       }

//       const mentorStartTime = convertToMinutes(mentorStart);
//       const mentorEndTime = convertToMinutes(mentorEnd);

//       console.log('mentorStartTime', mentorStartTime);
//       console.log('queryStartTime', queryStartTime);
//       console.log('mentorEndTime', mentorEndTime);
//       console.log('queryStartTime', queryEndTime);

//       // return (
//       //   (mentorStartTime < queryEndTime && mentorEndTime > queryStartTime) ||
//       //   (queryStartTime >= mentorStartTime && queryEndTime >= mentorEndTime)
//       // );
//       // return queryStartTime >= mentorStartTime && queryEndTime >= mentorEndTime;
//       // return queryStartTime >= mentorStartTime && queryEndTime >= mentorEndTime;
//       //   return (
//       //   (mentorStartTime < queryEndTime && mentorEndTime > queryStartTime) ||
//       //   (queryStartTime < mentorEndTime && queryEndTime > mentorStartTime)
//       // );
//         return (
//           (mentorStartTime < queryStartTime && mentorEndTime > queryEndTime)
//         );
//     });
//   }

//   // Apply sorting if specified
//   // Apply sorting if specified
//   if (sort) {
//     console.log('sort', sort);
//     const sortFields = sort
//       .split(',')
//       .reduce((acc: Record<string, number>, field: string) => {
//         const direction = field.startsWith('-') ? -1 : 1;
//         const fieldName = field.startsWith('-') ? field.substring(1) : field;
//         acc[fieldName] = direction;
//         return acc;
//       }, {});

//     console.log('sortFields', sortFields);
    
//     // Apply sorting at the database level instead of in-memory sorting
//     mentorRegistrations = await MentorRegistration.find(queryConditions)
//       .populate('mentorId')
//       .sort(sortFields) // MongoDB sort operator
//       .exec();
//   }

//   // Pagination setup
//   const pageNumber = parseInt(String(page), 10) || 1;
//   const limitNumber = parseInt(String(limit), 10) || 10;
//   const skip = (pageNumber - 1) * limitNumber;

//   // Slice the results for pagination
//   const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);

//   // Return the paginated result along with meta data
//   return {
//     meta: {
//       total: mentorRegistrations.length,
//       page: pageNumber,
//       limit: limitNumber,
//     },
//     result: paginatedResults,
//   };
// };














// const getAllMentorRegistrationQuery = async (
//   query: Record<string, unknown>,
// ) => {
//   console.log('query', query);

//   // Destructure the query parameters
//   const { availableTime, searchTerm, sort, page, limit, ...filters }: any =
//     query;

//   // Initialize the base query conditions
//   let queryConditions: Record<string, any> = {};
//   console.log('queryConditions 1', queryConditions);

//   // Handle the availableTime filter (convert into minutes)
//   if (availableTime && typeof availableTime === 'string') {
//     let [startTimeQuery, endTimeQuery] = availableTime.split(' - ');
//     const queryStartTime = convertToMinutes(startTimeQuery);
//     const queryEndTime = convertToMinutes(endTimeQuery);

//     // Add filtering logic for availableTime
//     queryConditions.availableTime = {
//       $gte: queryStartTime,
//       $lte: queryEndTime,
//     };

//     console.log('availableTime filters added to queryConditions');
//   }

//   // Add the text search if searchTerm is provided
//   if (searchTerm) {
//     queryConditions.$text = { $search: String(searchTerm) };
//   }

//   console.log('queryConditions with filters', queryConditions);

//   // Add additional filters
//   if (filters) {
//     for (const [key, value] of Object.entries(filters)) {
//       queryConditions[key] = value;
//     }
//   }

//   // Query the database to fetch mentor registrations
//   let mentorRegistrations = await MentorRegistration.find(queryConditions)
//     .populate('mentorId') // Assuming mentorId is a reference to the User model
//     .exec();

//   // Apply sorting if specified
//   if (sort) {
//     console.log('sort', sort);
//     const sortFields = sort
//       .split(',')
//       .reduce((acc: Record<string, number>, field: string) => {
//         const direction = field.startsWith('-') ? -1 : 1;
//         const fieldName = field.startsWith('-') ? field.substring(1) : field;
//         acc[fieldName] = direction;
//         return acc;
//       }, {});

//     console.log('sortFields', sortFields);

//     // Apply sorting at the database level instead of in-memory sorting
//     mentorRegistrations = await MentorRegistration.find(queryConditions)
//       .populate('mentorId')
//       .sort(sortFields) // MongoDB sort operator
//       .exec();
//   }

//   // Pagination setup
//   const pageNumber = parseInt(String(page), 10) || 1;
//   const limitNumber = parseInt(String(limit), 10) || 10;
//   const skip = (pageNumber - 1) * limitNumber;

//   // Slice the results for pagination
//   const paginatedResults = mentorRegistrations.slice(skip, skip + limitNumber);

//   // Return the paginated result along with meta data
//   return {
//     meta: {
//       total: mentorRegistrations.length,
//       page: pageNumber,
//       limit: limitNumber,
//     },
//     result: paginatedResults,
//   };
// };





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
  console.log('payload registrer', payload);
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
  const session = await mongoose.startSession(); // Start a new session
  session.startTransaction(); // Start the transaction

  try {
    // Log the id to track the request
    console.log('id id', id);

    // Find the mentor registration by ID
    const registerMentor =
      await MentorRegistration.findById(id).session(session);
    if (!registerMentor) {
      throw new AppError(404, 'Register Mentor Not Found!!');
    }

    // Find the mentor associated with this registration
    const mentor = await User.findById(registerMentor.mentorId).session(
      session,
    );
    if (!mentor) {
      throw new AppError(404, 'Mentor Not Found!!');
    }

    // Update the status of the mentor registration to 'accept'
    const mentorRegistration:any = await MentorRegistration.findByIdAndUpdate(
      id,
      { status: 'accept' },
      { new: true, session }, // Make sure the session is used here
    );

    // Update the mentor's registration ID in the User model
    const updatedMentor = await User.findByIdAndUpdate(
      registerMentor.mentorId,
      { mentorRegistrationId: mentorRegistration._id },
      { new: true, session }, // Use the session here as well
    );

    // Call wallet service to add funds to the mentor's wallet
    const addWallet = await walletService.addWalletService(mentor._id, session);

    // Commit the transaction if all operations were successful
    await session.commitTransaction();
    session.endSession(); // End the session

    // Return the updated mentor registration
    return mentorRegistration;
  } catch (error) {
    console.error('Transaction Error:', error);
    // If any operation fails, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow the error to be handled further up
  }
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
