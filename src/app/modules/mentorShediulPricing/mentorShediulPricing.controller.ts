import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { mentorShediulPricingService } from "./mentorShediulPricing.service";
import AppError from "../../error/AppError";

const getAllMentorShedulePricing = catchAsync(async (req, res) => {
    const result =
      await mentorShediulPricingService.getMentorShediulPricingService();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Mentor Shediul Pricing are retrived Successfull!!',
      data: result,
    });
})

const updateMentorShedulePricing = catchAsync(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    if(!data.price){
        throw new AppError(httpStatus.BAD_REQUEST, "Price is required")
    }

    data.price = Number(data.price);
    const result =
      await mentorShediulPricingService.updateMentorShediulPricingService(
        id,
        data,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Mentor Shediul Pricing are Updated Successfull!!',
      data: result,
    });
})


export const mentorShediulPricingController = {
  getAllMentorShedulePricing,
  updateMentorShedulePricing,
};