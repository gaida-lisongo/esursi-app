import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginAdmin, logoutAdmin } from "@/lib/actions/auth/actions";
import { updateAgent, updateAdmin } from "@/lib/actions/personnels/agent/actions";

interface AdminUser {
    id: string;
    agent: any;
    role: string;
}

interface AdminState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Auth Actions
    login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;

    // Persistence Actions (Interacting with Server Actions)
    handleUpdateAgent: (agentId: string, formData: any) => Promise<{ success: boolean; message: string }>;
    handleUpdateAdmin: (adminId: string, formData: any) => Promise<{ success: boolean; message: string }>;

    // UI Helpers
    clearError: () => void;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (identifier, password) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await loginAdmin(identifier, password);
                    if (result.success && result.user && result.token) {
                        set({
                            user: result.user,
                            token: result.token,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true, message: result.message };
                    } else {
                        set({ isLoading: false, error: result.message });
                        return { success: false, message: result.message || "Erreur inconnue" };
                    }
                } catch (err: any) {
                    const message = err.message || "Erreur lors de la connexion";
                    set({ isLoading: false, error: message });
                    return { success: false, message };
                }
            },

            logout: async () => {
                await logoutAdmin();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            handleUpdateAgent: async (agentId, formData) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await updateAgent(agentId, formData);
                    if (result.success) {
                        // If the updated agent is the current logged-in user, update local state
                        const currentUser = get().user;
                        if (currentUser && currentUser.agent._id === agentId) {
                            set({
                                user: {
                                    ...currentUser
                                }
                            });
                        }
                    }
                    set({ isLoading: false });
                    return result;
                } catch (err: any) {
                    set({ isLoading: false, error: err.message });
                    return { success: false, message: err.message };
                }
            },

            handleUpdateAdmin: async (adminId, formData) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await updateAdmin(adminId, formData);
                    if (result.success) {
                        // If the updated admin is the current logged-in user, update role
                        const currentUser = get().user;
                        if (currentUser && currentUser.id === adminId) {
                            set({
                                user: {
                                    ...currentUser,
                                    role: formData.role || currentUser.role,
                                }
                            });
                        }
                    }
                    set({ isLoading: false });
                    return result;
                } catch (err: any) {
                    set({ isLoading: false, error: err.message });
                    return { success: false, message: err.message };
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "admin-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
