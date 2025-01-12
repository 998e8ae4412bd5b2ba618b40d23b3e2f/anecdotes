import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import AlertMessage from "@/components/AlertMessage";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose,  }) => {
    return (<Dialog
        open={isOpen} onOpenChange={onClose}>
        <DialogContent className="p-0 bg-transparent border-none">
            <DialogTitle className="hidden"/>
            <AlertMessage
                title='Ви не можете цього зробит :('
                content='тому що, ви не увійшли, або зовсім не зареєстровані'
                buttons={
                [
                    {name: 'увійти', url: '/auth/login'}
                ]} />
        </DialogContent>
    </Dialog>);
};