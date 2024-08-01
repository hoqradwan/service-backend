import { createCookieService, getAllCookiesService, getCookieByIdService, updateCookieByIdService } from './cookie.service.js';

// create method for cookie
export const createCookie = async (req, res) => {
    try {
        const data = req.body;

        // Check if required data is provided
        if (!data.serviceName || !data.account || !data.cookie || !data.csrfToken || !data.status) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const savedCookie = await createCookieService(data);
        if (savedCookie) {
            // Send a success response
            return res.status(201).json({
                message: 'Cookie created successfully!',
                data: savedCookie
            });
        }


    } catch (error) {
        // Handle errors and send an error response
        console.error('Error creating cookie:', error);
        return res.status(500).json({
            message: 'Failed to create cookie',
            error: error.message
        });
    }
};


// Get method for cookie
export const getAllCookies = async (req, res) => {
    try {
        // Retrieve all cookies from the database
        const cookies = await getAllCookiesService();

        // Check if cookies exist
        if (cookies.length === 0) {
            return res.status(404).json({
                message: 'No cookies found'
            });
        }

        // Send a success response with the cookies data
        return res.status(200).json({
            message: 'Cookies retrieved successfully!',
            data: cookies
        });

    } catch (error) {
        // Handle errors and send an error response
        console.error('Error retrieving cookies:', error);
        return res.status(500).json({
            message: 'Failed to retrieve cookies',
            error: error.message
        });
    }
};


// Get method for single cookie with _id
export const getCookieById = async (req, res) => {
    try {
        // Extract the _id from the request parameters
        const { id } = req?.params;

        // Find the cookie by _id
        const cookie = await getCookieByIdService(id);

        // Check if the cookie exists
        if (!cookie) {
            return res.status(404).json({
                message: 'Cookie not found'
            });
        }

        // Send a success response with the cookie data
        return res.status(200).json({
            message: 'Cookie retrieved successfully!',
            data: cookie
        });

    } catch (error) {
        // Handle errors and send an error response
        console.error('Error retrieving cookie:', error);

        // Check for invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid cookie ID format'
            });
        }

        return res.status(500).json({
            message: 'Failed to retrieve cookie',
            error: error.message
        });
    }
};


// Update method for cookie with _id
export const updateCookieById = async (req, res) => {
    try {
        // Extract the _id from the request parameters
        const { id } = req.params;

        // Update data
        const updateData = req.body;

        // Find the cookie by _id and update it with the new data
        const updatedCookie = await updateCookieByIdService(id,updateData);

        // Check if the cookie exists
        if (!updatedCookie) {
            return res.status(404).json({
                message: 'Cookie not found'
            });
        }

        // Send a success response with the updated cookie data
        return res.status(200).json({
            message: 'Cookie updated successfully!',
            data: updatedCookie
        });

    } catch (error) {
        // Handle errors and send an error response
        console.error('Error updating cookie:', error);

        // Check for invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: 'Invalid cookie ID format'
            });
        }

        return res.status(500).json({
            message: 'Failed to update cookie',
            error: error.message
        });
    }
};

