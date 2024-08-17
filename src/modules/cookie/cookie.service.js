import { Cookie } from "./cookie.model.js";

// create cookie service
export const createCookieService = async (data) => {
  // Create a new Cookie instance
  const newCookie = new Cookie(data);
  // Save the document to the database
  return await newCookie?.save();
};

// Get all cookie service
export const getAllCookiesService = async (page, limit) => {
  const skip = (page - 1) * limit;

  return await Cookie.aggregate([
    {
      $setWindowFields: {
        sortBy: { createdAt: -1 },
        output: {
          serial: {
            $documentNumber: {},
          },
        },
      },
    },
    {
      $project: {
        __v: 0, // Exclude __v field
      }
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    }
  ]);
};

// find single cookie service with id
export const getCookieByIdService = async (id) => {
  return await Cookie.findById(id).select(' -createdAt -updatedAt -__v');
};

// Find single cookie service with account email
export const getCookieByAccountEmailService = async (email) => {
  return await Cookie?.findOne({ account: email });
};

// update cookie service
export const updateCookieByIdService = async (id, updateData) => {
  // update the cookie
  return await Cookie?.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true // Ensure that the update data conforms to the schema
  });
};

// delete cookie service
export const deleteCookieByIdService = async (id) => {
  // delete the cookie
  return Cookie?.findByIdAndDelete(id);
};

// get the total number of cookies service
export const getTotalDocumentCountService = async () => {
  return Cookie.countDocuments({ status: 'active' });
};

// get the total number of cookies service
export const getRandomAccountService = async (randomIndex) => {
  return Cookie?.findOne({ status: 'active' })?.skip(randomIndex);
};