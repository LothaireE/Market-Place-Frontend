import React from "react";
import { Link } from "react-router";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import type { LinkProps } from "react-router";

// type TextTransform = "none" | "capitalize" | "uppercase" | "lowercase" | undefined;

type LinkButtonProps = ButtonProps & LinkProps; // & TextTransform ;

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
    (props, ref) => {
        const { to, replace, state, target, ...buttonProps } = props;

        return (
            <Button
                // style={{ textTransform : buttonProps.textTransform ?? "none" }}
                component={Link}
                to={to}
                replace={replace}
                state={state}
                target={target}
                ref={ref}
                {...buttonProps}
            />
        );
    }
);

LinkButton.displayName = "LinkButton";

export default LinkButton;
