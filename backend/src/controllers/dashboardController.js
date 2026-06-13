import * as dashboardService from "../services/dashboardService.js";

export const getDashboard = async (
    req,
    res
) => {
    try {
        const dashboard =
            await dashboardService.getDashboard(
                req.user.userId
            );
        
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};