import mongoose from "mongoose";
import { IMentorShediulPricing } from "./mentorShediulPricing.interface";

const mentorShediulPricingSchema = new mongoose.Schema<IMentorShediulPricing>(
    {
        price:{
            type:Number,
            required:true,
            default:15
        }
    }
)

const MentorShediulPricing = mongoose.model<IMentorShediulPricing>('MentorShediulPricing', mentorShediulPricingSchema);
export default MentorShediulPricing

// Create function to insert data into the database