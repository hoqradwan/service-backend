import { isCookieValid } from './cookie.controller.js';
import { Cookie } from './cookie.model.js';
import { updateCookieByIdService } from './cookie.service.js';

export const checkRecentlyInactiveCookies = async () => {
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const recentInactiveCookies = await Cookie.find({
      status: 'inactive',
      createdAt: { $gte: twoDaysAgo },
    });

    if (!recentInactiveCookies.length) {
      console.log('No inactive cookies found from the last 2 days.');
      return;
    }

    for (const cookie of recentInactiveCookies) {
      try {
        const isValid = await isCookieValid(cookie);
        if (isValid) {
          await updateCookieByIdService(cookie._id, { status: 'active' });
          //   console.log(`✅ Cookie ${cookie._id} reactivated.`);
        }
      } catch (err) {
        console.error(`Error validating cookie ${cookie._id}:`, err);
      }
    }
  } catch (error) {
    console.error('🔥 Error checking inactive cookies:', error);
  }
};
