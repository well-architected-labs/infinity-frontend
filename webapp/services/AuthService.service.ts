import { User } from "../model/entities/User.entity";
import { Authorized } from "../model/entities/Authorized.dto";
import { HttpService } from "./HttpService.service";

export default class AuthService {
    static async signIn(user: User): Promise<User> {
        const response = await HttpService.post<Authorized>("/v1/authorization/sign-in", user);
        localStorage.setItem("token", response.token);
        const currentUser = await HttpService.get<User>("/v1/users/current");
        return currentUser;
    }

    static async signUp(user: User): Promise<User> {
        const response = await HttpService.post<Authorized>("/v1/authorization/sign-up", user);
        localStorage.setItem("token", response.token);
        const currentUser = await HttpService.get<User>("/v1/users/current");
        return currentUser;
    }

    static async current(): Promise<User> {
        return await HttpService.get<User>("/v1/users/current");
    }
}
