import { UserModel } from "../modules/user/user.model.js";


export const adminMiddleware = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                isOk: false,
                message: "User not found."
            });
        }

        if (user.role === 'admin') {
            // User is an admin
            req.isAdmin = true;
        } else {
            // User is not an admin
            req.isAdmin = false;
        }

        req.userId = userId;
        next();
    } catch (error) {
        console.error("Error in admin middleware:", error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error"
        });
    }
};