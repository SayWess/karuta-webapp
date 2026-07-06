import clsx from "clsx";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-center min-h-[100%]">
            {children}
        </div>
    );
}
