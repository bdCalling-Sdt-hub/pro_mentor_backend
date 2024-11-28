import { ClientSession, Types } from 'mongoose';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { TWallet } from './wallet.interface';
import { Wallet } from './wallet.model';


const addWalletService = async (mentorId: string, session: ClientSession) => {
  // Step 1: Input validation
  if (!mentorId) {
    throw new AppError(400, 'Mentor ID is required!');
  }

  if (!Types.ObjectId.isValid(mentorId)) {
    throw new AppError(400, 'Invalid Mentor ID format!');
  }

  // Step 2: Find the mentor
  const mentor = await User.findById(mentorId).session(session); // Use session here for transaction
  if (!mentor) {
    throw new AppError(404, 'Mentor not found!');
  }

  if (mentor.role !== 'mentor') {
    throw new AppError(400, 'The user is not a mentor!');
  }

  // Step 4: If the wallet doesn't exist, create a new wallet
  const payload: TWallet = {
    mentorId: new Types.ObjectId(mentorId), // Ensure the mentorId is of type ObjectId
    amount: 0, // Initialize the balance to 0
  };

  const wallet = await Wallet.create([payload], { session }); // Use session here to ensure the creation is part of the transaction
  return wallet[0]; // Return the newly created wallet
};



const userWalletGetService = async (mentorId: string) => {
  if (!mentorId) {
    throw new AppError(400, 'Mentor ID is required!');
  }

  if (!Types.ObjectId.isValid(mentorId)) {
    throw new AppError(400, 'Invalid Mentor ID format!');
  }
  const mentor = await User.findById(mentorId);
  if (!mentor) {
    throw new AppError(404, 'Mentor not found!');
  }

  if (mentor.role !== 'mentor') {
    throw new AppError(400, 'The user is not a mentor!');
  }
  const wallet = await Wallet.findOne({ mentorId });
  return wallet;
};


const deletedWallet = async (mentorId: string) => {
  if (!mentorId) {
    throw new AppError(400, 'Mentor ID is required!');
  }

  if (!Types.ObjectId.isValid(mentorId)) {
    throw new AppError(400, 'Invalid Mentor ID format!');
  }
  const mentor = await User.findById(mentorId);
  if (!mentor) {
    throw new AppError(404, 'Mentor not found!');
  }

  if (mentor.role !== 'mentor') {
    throw new AppError(400, 'The user is not a mentor!');
  }

  const wallet = await Wallet.findOne({ mentorId });
  if (!wallet) {
    throw new AppError(404, 'Wallet not found!');
  }

  const result = await Wallet.findOneAndDelete({ mentorId });
  return result;
  }


export const walletService = {
  addWalletService,
  userWalletGetService,
  deletedWallet,
};
