import { Cookie } from './cookie.model.js';

// create cookie service
export const createCookieService = async (data) => {
  // Create a new Cookie instance
  const newCookie = new Cookie(data);
  // Save the document to the database
  return await newCookie?.save();
};

// Get all cookie service
export const getAllCookiesService = async ({
  page = 1,
  limit = 10,
  search = '',
  serviceName = '',
}) => {
  const skip = (page - 1) * limit;

  // ---------------------------
  // MATCH FILTER
  // ---------------------------
  const matchQuery = {};

  // SEARCH
  if (search) {
    matchQuery.$or = [
      {
        serviceName: {
          $regex: search,
          $options: 'i',
        },
      },

      {
        account: {
          $regex: search,
          $options: 'i',
        },
      },

      {
        email: {
          $regex: search,
          $options: 'i',
        },
      },

      {
        source: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  // SERVICE FILTER
  if (serviceName && serviceName !== 'All') {
    matchQuery.serviceName = serviceName;
  }

  // ---------------------------
  // TOTAL
  // ---------------------------
  const total = await Cookie.countDocuments(matchQuery);

  // ---------------------------
  // COOKIES
  // ---------------------------
  const cookies = await Cookie.aggregate([
    {
      $match: matchQuery,
    },

    // SORT FIRST
    {
      $sort: {
        createdAt: -1,
      },
    },

    // PAGINATION
    {
      $skip: skip,
    },

    {
      $limit: limit,
    },

    // SERIAL AFTER PAGINATION
    {
      $setWindowFields: {
        sortBy: {
          createdAt: -1,
        },

        output: {
          serial: {
            $documentNumber: {},
          },
        },
      },
    },

    // REMOVE FIELDS
    {
      $project: {
        __v: 0,
      },
    },
  ]);

  return {
    cookies,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// export const getAllCookiesService = async (page, limit) => {
//   const skip = (page - 1) * limit;

//   return await Cookie.aggregate([
//     {
//       $setWindowFields: {
//         sortBy: { createdAt: -1 },
//         output: {
//           serial: {
//             $documentNumber: {},
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         __v: 0, // Exclude __v field
//       }
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     }
//   ]);
// };

// find single cookie service with id
export const getCookieByIdService = async (id) => {
  return await Cookie.findById(id).select(' -createdAt -updatedAt -__v');
};

// Find single cookie service with account email
export const getCookieByAccountEmailService = async (account, serviceName) => {
  return await Cookie?.findOne({ account, serviceName });
};

// update cookie service
export const updateCookieByIdService = async (id, updateData) => {
  // update the cookie
  return await Cookie?.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true, // Ensure that the update data conforms to the schema
  });
};

// delete cookie service
export const deleteCookieByIdService = async (id) => {
  // delete the cookie
  return Cookie?.findByIdAndDelete(id);
};

// get the total number of cookies service
export const getTotalDocumentCountService = async (serviceName) => {
  return Cookie.countDocuments({ serviceName, status: 'active' });
};

// get the total number of cookies service
export const getRandomAccountService = async (serviceName, randomIndex) => {
  return Cookie?.findOne({ serviceName, status: 'active' })?.skip(randomIndex);
};
