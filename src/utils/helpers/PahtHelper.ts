export const removeLastRoute = (pathname: string): string => {
    let parts = pathname.split("/");
    parts.pop();
    let newPathname = parts.join("/");
    return newPathname;
};
