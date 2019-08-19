
export interface AuthApi {

    startAuth(): Promise<string|undefined>;
    logout(): Promise<void>;

    getUserId(): Promise<string|undefined>;
    //readonly isAuth: boolean;

}
