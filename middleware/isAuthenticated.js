import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
   const token = req.cookies.token;
   if (!token) {
      return res.status(401).json({
         message: "Unauthorized",
         success: false,
      });
   }
   
   try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.userId;
      next();
   } catch (error) {
      return res.status(401).json({
         message: "Invalid token",
         success: false,
      });
   }
};

export default isAuthenticated;
