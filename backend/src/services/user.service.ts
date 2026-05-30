import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS, MESSAGES} from "../constants/constant.js"
import bcrypt  from "bcryptjs";

class UserService {

    async registerUser({name, email, password}: { name: string; email: string; password: string }) {

        const existingUser = await User.findOne({email});

        if(existingUser) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.USER_ALREADY_EXIST)
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return user;
    }

    async loginUser({email, password}: { email: string; password: string }) {

        const user = await User.findOne({email});

        if(!user) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.USER_DOES_NOT_EXIST)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.INVALID_CREDENTIALS)
        }

        return user;
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);

        if(!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER_DOES_NOT_EXIST)
        }

        return user;
    }

}

export default new UserService();
