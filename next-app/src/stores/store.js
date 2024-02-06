import { create } from 'zustand';

export const usernameStore = create(set => ({
    username: "",
    setUsername: (newUsername) => set({ username: newUsername }),
}))