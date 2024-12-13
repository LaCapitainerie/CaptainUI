"use client"

import { userType } from "@/types/types";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState(fallbackValue);
    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored ? JSON.parse(stored) : fallbackValue);
    }, [fallbackValue, key]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}

export function useAuth() {
    if(typeof document === "undefined") return null;
    const cookie = document.cookie.split(";").find(c => c.startsWith("user:auth"));
    if(cookie) {
        const user = JSON.parse(cookie.split("=")[1]) as userType;
        return user;
    }
    return null;
}