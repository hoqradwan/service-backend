import { Cookie } from "./cookie.model.js";

// create cookie service
export const createCookieService = async (data) => {
  // Create a new Cookie instance
  const newCookie = new Cookie(data);
  // Save the document to the database
  return await newCookie.save();
};

// get all cookie service
export const getAllCookiesService = async () => {
  return await Cookie.find();
};

// find single cookie service
export const getCookieByIdService = async (id) => {
  // Find the cookie by _id
  return await Cookie.findById(id);
};

// update cookie service
export const updateCookieByIdService = async (id, updateData) => {
  // update the cookie
  return await Cookie.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true // Ensure that the update data conforms to the schema
  });
};