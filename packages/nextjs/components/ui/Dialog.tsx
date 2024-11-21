import React from "react";

export function Dialog({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">{children}</div>;
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-gray-200 pb-4 mb-4">{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
}

export function DialogTrigger({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button className={`text-teal-200 hover:text-teal-100 underline underline-offset-4 ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
