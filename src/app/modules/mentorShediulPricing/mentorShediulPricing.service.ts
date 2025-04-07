import MentorShediulPricing from "./mentorShediulPricing.model";

const getMentorShediulPricingService = async () => {
    const result = await MentorShediulPricing.findOne({});
    return result;
}

const updateMentorShediulPricingService = async (payload: any) => {
  const newPrice = payload && typeof payload  ? payload : {price:15};
  console.log('newPrice=', newPrice);

  try {
    const result = await MentorShediulPricing.updateOne(
      {},
      { $set: { price: newPrice.price } },
      { upsert: true },
    );

    console.log('Update result:', result);

    return result;
  } catch (error) {
    console.error('Error updating pricing:', error);
    throw new Error('Unable to update pricing');
  }
};


export const mentorShediulPricingService = {
  getMentorShediulPricingService,
  updateMentorShediulPricingService,
};



