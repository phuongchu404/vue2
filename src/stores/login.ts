import { defineStore } from "pinia";
import { authService } from "@/services/login";

interface User {
    id: number;
    username: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
    }),

    actions: {
        async login(payload: { username: string; password: string }) {
            const res = await authService.login(payload);

            if (res.success) {
                if (res.code === "0") {
                    this.user = res.data;
                    this.token = res.data?.token ?? null;
                    sessionStorage.setItem("user", JSON.stringify(res.data));
                    sessionStorage.setItem("TOKEN", this.token || "");
                }
            }

            return res;
        },

        logout() {
            this.user = null;
            this.token = null;
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("TOKEN");
        },

        loadFromSession() {
            const user = sessionStorage.getItem("user");
            const token = sessionStorage.getItem("TOKEN");
            this.user = user ? JSON.parse(user) : null;
            this.token = token || null;
        },
    },
});
