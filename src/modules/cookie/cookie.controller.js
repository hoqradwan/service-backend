import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync.js';
import sendResponse from '../../utils/sendResponse.js';
import { createCookieService, deleteCookieByIdService, getAllCookiesService, getCookieByAccountEmailService, getCookieByIdService, updateCookieByIdService } from './cookie.service.js';
import mongoose from 'mongoose';

// create method for cookie
export const createCookie = catchAsync(async (req, res) => {
    const data = req.body;
    // Check if required data is provided
    if (!data.serviceName || !data.account || !data.project || !data.cookie || !data.csrfToken || !data.status) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Missing required fields',
            data: null,
        });
    }
    // Checking if the account with same email already exists or not
    const isAccountExist = await getCookieByAccountEmailService(data.account);
    if (isAccountExist) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Account already exists with this email',
            data: null,
        });
    }
    const savedCookie = await createCookieService(data);
    if (savedCookie) {
        // Send a success response
        return sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Cookie created successfully!',
            data: savedCookie,
        });
    }
});



// Get method for cookie
export const getAllCookies = catchAsync(async (req, res) => {
    // Retrieve all cookies from the database
    const cookies = await getAllCookiesService();

    // Check if cookies exist
    if (cookies.length === 0) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: 'No cookies found',
            data: null,
        });
    }

    // Send a success response with the cookies data
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Cookies retrieved successfully!',
        data: cookies,
    });
});


// Get method for single cookie with _id
export const getCookieById = catchAsync(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Invalid Id format',
            data: null,
        });
    }

    // Find the cookie by id
    const cookie = await getCookieByIdService(id);

    // Check if the cookie exists
    if (!cookie) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: 'Cookie not found',
            data: null,
        });
    }

    // Send a success response with the cookie data
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Cookie retrieved successfully!',
        data: cookie,
    });
});


// Update method for cookie with _id
export const updateCookieById = catchAsync(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req?.params;

    // Update data
    const updateData = req?.body;

    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Invalid Id format',
            data: null,
        });
    }

    // Find the cookie by id and update it with the new data
    const updatedCookie = await updateCookieByIdService(id, updateData);

    // Check if the cookie exists
    if (!updatedCookie) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: 'Cookie not found',
            data: null,
        });
    }

    // Send a success response with the updated cookie data
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Cookie updated successfully!',
        data: updatedCookie,
    });
});



// delete method for cookie with id
export const deleteCookieById = catchAsync(async (req, res) => {
    // Extract the id from the request parameters
    const { id } = req.params;

    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Invalid Id format',
            data: null,
        });
    }

    // Find and delete the cookie by id
    const deletedCookie = await deleteCookieByIdService(id);

    // Check if the cookie was found and deleted
    if (!deletedCookie) {
        return sendResponse(res, {
            success: false,
            statusCode: httpStatus.NOT_FOUND,
            message: 'Cookie not found',
            data: null,
        });
    }

    // Send a success response confirming deletion
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Cookie deleted successfully!',
        data: deletedCookie,
    });
});
