import catchAsync from "../../utils/catchAsync.js";

export const createNotification = catchAsync(async(req,res)=>{
    const { serviceName, content } = req.body;
    const result = await createNotificationIntoDB(serviceName, content);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Notification created successfully',
        data: result,
      });
})