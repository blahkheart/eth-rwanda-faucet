import React from "react";

function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm" {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col space-y-1.5 p-6" {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className="text-2xl font-semibold leading-none tracking-tight" {...props}>
      {children}
    </h3>
  );
}

function CardDescription({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="text-sm text-muted-foreground" {...props}>
      {children}
    </p>
  );
}

function CardContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="p-6 pt-0" {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center p-6 pt-0" {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
