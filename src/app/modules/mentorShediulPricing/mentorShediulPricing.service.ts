import MentorShediulPricing from "./mentorShediulPricing.model";

const getMentorShediulPricingService = async () => {
    const result = await MentorShediulPricing.findOne({});
    return result;
}

const updateMentorShediulPricingService = async (id:string,payload:any) => {
    const result = await MentorShediulPricing.findByIdAndUpdate(id, payload, { new: true });
    return result;
}

export const mentorShediulPricingService = {
  getMentorShediulPricingService,
  updateMentorShediulPricingService,
};



