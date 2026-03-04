export function capitalizeFirstLetter(string: string): string {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const handleDateFormat = (dateString: string): string => {
    return new Date(dateString || "").toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
