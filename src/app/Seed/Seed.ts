/** @format */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/index';
import MentorShediulPricing from '../modules/mentorShediulPricing/mentorShediulPricing.model';




// Sample data
const usersData = [
  {
    fullName: 'Site Admin',
    nickName: 'Admin',
    phone: '1234567890',
    email: 'biuro@redakcjanaukowa.pl',
    password: 'admin@2024justyna', // This will be hashed
    role: 'admin',
    commission: 0,
    photo: '/uploads/profile/default-user.jpg',
    gender: 'female',
    dob: new Date('1990-01-01'),
    language: 'English',
    bankAccount: '123456789',
    accountType: 'savings',
    accountCountry: 'USA',
    branchName: 'Main Branch',
    country: 'USA',
    city: 'New York',
    zipCode: '10001',
    address: '123 Elm St, New York, NY 10001',
    about: 'Admin user',
    textSample: 'Sample text for Alice.',
    isOnline: false,
    isDelete: false,
    isBlock: false,
    isActive: true,
  },
  {
    fullName: 'Md. Sohag Hossain',
    nickName: 'Sohag',
    phone: '1122334455',
    email: 'sohag@gmail.com',
    password: 'hello123', // This will be hashed
    role: 'user',
    commission: 0,
    photo: '/uploads/profile/default-user.jpg',
    gender: 'male',
    dob: new Date('2000-12-31'),
    language: 'English',
    bankAccount: '456789123',
    accountType: 'savings',
    accountCountry: 'USA',
    branchName: 'Uptown Branch',
    country: 'USA',
    city: 'Chicago',
    zipCode: '60601',
    address: '789 Oak St, Chicago, IL 60601',
    about: 'Regular user',
    preferredField: ['General'],
    documents: [],
    certificate: '',
    cv: '',
    textSample: 'Sample text for Charlie.',
    isOnline: '0',
    isDelete: false,
    isBlock: false,
    isActive: true,
  },
];

// Function to drop the entire database
// const dropDatabase = async () => {
//   try {
//     await mongoose.connection.dropDatabase();
//     // console.log('------------> Database dropped successfully! <------------');
//   } catch (err) {
//     console.error('Error dropping database:', err);
//   }
// };

// Helper function to hash passwords
const hashPassword = async (password:any) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

// Function to seed users
// const seedUsers = async () => {
//   try {
//     await User.deleteMany();
//     const hashedUsersData = await Promise.all(
//       usersData.map(async (user) => {
//         const hashedPassword = await hashPassword(user.password);
//         return { ...user, password: hashedPassword }; // Replace the password with the hashed one
//       }),
//     );
//     await User.insertMany(hashedUsersData);
//     // console.log('Users seeded successfully!');
//   } catch (err) {
//     console.error('Error seeding users:', err);
//   }
// };


// Function to seed MentorShediulPricing
const mentorShediulPricingSeed = async () => {
  try {
    await MentorShediulPricing.deleteMany(); // Clears existing data
    const priceData = { price: 15 };
    await MentorShediulPricing.create(priceData); // Correct method to insert data
    // console.log('Mentor Pricing seeded successfully!');
  } catch (err) {
    console.error('Error seeding Mentor Pricing:', err);
  }
};


// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.database_url as string); // Simplified connection options
    // console.log('Connected to MongoDB');
  } catch (err:any) {
    console.error('Error connecting to MongoDB:', err.message || err);
    process.exit(1); // Exit the process with a failure code
  }
};


// Call seeding functions
const seedDatabase = async () => {
    await connectToDatabase();
  try {
    // await dropDatabase();
    // await seedUsers();
   await mentorShediulPricingSeed();
    // console.log('------------> Database seeding completed! <------------');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
