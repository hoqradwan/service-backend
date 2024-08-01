import { Cookie } from './cookie.model.js';

export const createCookie = async (req, res) => {
    try {
        const data = req.body;

        // Check if required data is provided
        if (!data.serviceName || !data.account  || !data.cookie || !data.csrfToken || !data.status) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        // Create a new Cookie instance
        const newCookie = new Cookie(data);

        // Save the document to the database
        const savedCookie = await newCookie.save();

        // Send a success response
        res.status(201).json({
            message: 'Cookie created successfully!',
            data: savedCookie
        });

    } catch (error) {
        // Handle errors and send an error response
        console.error('Error creating cookie:', error);
        res.status(500).json({
            message: 'Failed to create cookie',
            error: error.message
        });
    }
};
