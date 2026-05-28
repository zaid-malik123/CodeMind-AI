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

}

export default new UserService();
