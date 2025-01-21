'use client'
import {useSession} from "next-auth/react";
import {useState} from "react";
import {AuthModal} from "@/components/AuthModal";

export const useRequireAuth = () => {
    const { data: session } = useSession();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);

    const requireAuth = (action: () => void) => {
        if (!session) {
            setAuthModalOpen(true);
        } else {
            action();
        }
    };

    const AuthModalComponent = <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)}/>

    return { requireAuth, AuthModalComponent };
};
