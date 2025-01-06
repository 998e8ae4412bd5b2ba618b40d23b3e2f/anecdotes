import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>You must be logged in</DialogTitle>
                <p>Please log in to continue.</p>
                <button onClick={() => window.location.href = '/auth/signin'} className="btn-primary">
                    Log In
                </button>
            </DialogContent>
        </Dialog>
    );
};
