import { createMentorShediulPricing } from "../modules/mentorShediulPricing/mentorShediulPricing.model";

// Async function to call the create method
export const mentorAutoShediulPricing = async () => {
  const mentorShediulPricing = {
    price: 0,
  };
  await createMentorShediulPricing(mentorShediulPricing);
};
