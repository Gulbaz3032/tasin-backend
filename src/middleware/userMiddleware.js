import jwt from "jsonwebtoken";


export const userLogIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if(!token) {
            return res.status(404).json({
                message: "Token not found",
                success: false
            });
        }
        
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Decoded Token :- ${decodedToken}`)

        req.user = decodedToken;

        next();

    } catch (error) {
        console.log("server error");
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}