import mongoose from "mongoose";
import { IMentorShediulPricing } from "./mentorShediulPricing.interface";

const mentorShediulPricingSchema = new mongoose.Schema<IMentorShediulPricing>(
    {
        price:{
            type:Number,
            required:true,
            default:0
        }
    }
)

const MentorShediulPricing = mongoose.model<IMentorShediulPricing>('MentorShediulPricing', mentorShediulPricingSchema);
export default MentorShediulPricing

// Create function to insert data into the database
export const createMentorShediulPricing = async (data:any) => {
    try {
        const mentorShediulPricing = new MentorShediulPricing(data);
        const savedData = await mentorShediulPricing.save();
        console.log('Data saved:', savedData);
    } catch (error) {
        console.error('Error saving data:', error);
    }
};