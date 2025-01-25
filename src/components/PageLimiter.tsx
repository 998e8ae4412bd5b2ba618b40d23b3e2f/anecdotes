type Props = {
    children: React.ReactNode;
    className?: string;
};

export const PageLimiter = ({ children, className }: Props) => {
    return <div className={`flex-1 px-4 pr-8 sm:px-12 w-full max-w-[1440px] mx-auto  ${className}`}>
        {children}
    </div>;
};
