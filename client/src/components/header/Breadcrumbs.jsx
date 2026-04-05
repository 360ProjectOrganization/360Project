import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

function formatCrumb(crumb) {
    return crumb.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumbs() {
    const { pathname } = useLocation();

    const showBreadcrumbs = ["/profile", "/company-portal", "/Admin"];
    if (!showBreadcrumbs.includes(pathname)) return null;

    const crumbs = pathname.split("/").filter(Boolean);

    const items = [{ label: "Home", to: "/" }];
    let currPath = "";

    if (pathname === "/") return null; // hide on home page
    
    for (const c of crumbs) {
        currPath += `/${c}`;
        const label = formatCrumb(c);
        items.push({ label, to: currPath });
    }

    return (
        <nav className="breadcrumbs">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={item.to} className="breadcrumbs-crumb">
                        {index > 0 && (
                            <span className="breadcrumbs-separator"> / </span>
                        )}
                        {isLast ? (
                            <span>{item.label}</span>
                        ) : (
                            <Link to={item.to}>{item.label}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}