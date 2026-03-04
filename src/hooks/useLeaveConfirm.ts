import { useEffect, useRef } from "react";
import { useBlocker } from "react-router";

type UseLeaveConfirmOptions = {
    when: boolean;
    message: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
};

export function useLeaveConfirm({
    when,
    message,
    onConfirm,
    onCancel,
}: UseLeaveConfirmOptions) {
    const blocker = useBlocker(when);
    const handleRef = useRef(false);

    useEffect(() => {
        if (blocker.state !== "blocked") {
            handleRef.current = false;
            return;
        }

        if (handleRef.current) return; // prevent double execution in StrictMode, as useBlocker is called twice on mount
        handleRef.current = true;

        const ok = window.confirm(message);

        if (!ok) {
            handleRef.current = false; // reset ref if user cancels, so that confirmation will be shown again on next attempt to leave
            onCancel?.();
            if (blocker.state === "blocked") blocker.reset();
            return;
        }
        void onConfirm?.();

        // proceed seulement si encore blocked
        if (blocker.state === "blocked") blocker.proceed();
    }, [blocker, message, onConfirm, onCancel]);
}
