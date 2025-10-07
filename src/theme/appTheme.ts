function getCssVar(name: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    return value || fallback;
}

export const appTheme = {
    palette: {
        primary: {
            main: getCssVar("--primary-main", "#2B4C7E"),
            light: getCssVar("--primary-light", "#496FAF"),
            dark: getCssVar("--primary-dark", "#1A2E50"),
        },
        secondary: {
            main: getCssVar("--secondary-main", "#C19A34"),
            light: getCssVar("--secondary-light", "#E2B857"),
            dark: getCssVar("--secondary-dark", "#A07F29"),
        },
        background: {
            default: getCssVar("--bg-default", "#F7F8FA"),
            paper: getCssVar("--bg-paper", "#FFFFFF"),
        },
        text: {
            primary: getCssVar("--text-primary", "#1C1C1C"),
            secondary: getCssVar("--text-secondary", "#5C5C5C"),
        },
        divider: getCssVar("--divider", "#E0E0E0"),
        success: {
            main: getCssVar("--success", "#3FA796"),
        },
        error: {
            main: getCssVar("--error", "#D64545"),
        },
        warning: {
            main: getCssVar("--warning", "#E6B325"),
        },
        info: {
            main: getCssVar("--info", "#4E97D1"),
        },
    },
    typography: {
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
    },
};

export const appThemeDark = {
    palette: {
        mode: "dark",
        primary: {
            main: getCssVar("--primary-main", "#496FAF"),
            light: getCssVar("--primary-light", "#6B8ED8"),
            dark: getCssVar("--primary-dark", "#2B4C7E"),
        },
        secondary: {
            main: getCssVar("--secondary-main", "#E2B857"),
            light: getCssVar("--secondary-light", "#F4CC70"),
            dark: getCssVar("--secondary-dark", "#A07F29"),
        },
        background: {
            default: getCssVar("--bg-default", "#121417"),
            paper: getCssVar("--bg-paper", "#1C1F24"),
        },
        text: {
            primary: getCssVar("--text-primary", "#F3F4F6"),
            secondary: getCssVar("--text-secondary", "#A6A8AB"),
        },
        divider: getCssVar("--divider", "#2E3238"),
        success: {
            main: getCssVar("--success", "#4EC9A3"),
        },
        error: {
            main: getCssVar("--error", "#E57373"),
        },
        warning: {
            main: getCssVar("--warning", "#E6B325"),
        },
        info: {
            main: getCssVar("--info", "#6BA5E7"),
        },
    },
    typography: {
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
    },
};
