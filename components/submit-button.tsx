"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
};

export function SubmitButton({ children, className, pendingLabel = "Saving..." }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className ?? "solid-button"} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
