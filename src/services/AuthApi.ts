
export interface AuthApi {

    startAuth(): Promise<string|undefined>;
    logout(): Promise<void>;

    getUserId(): Promise<string|undefined>;
    subscribe(onAuth: (uid?: string) => void): () => void;
}
