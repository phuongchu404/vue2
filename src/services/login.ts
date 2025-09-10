import * as Utils from "../utils";
export const authService = {
    login(payload: { username: string; password: string }) {
        return Utils.doPost("/api/sessions/login", payload);
    },
};