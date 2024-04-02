import React from "react";
import ResponsiveAppBar from "./appbar";

const Layout = ({children}) => {
    return (
        <>
            <ResponsiveAppBar />
            {children}
        </>
    )
}

export default Layout;

// const RolePages = {
//     driver: <DriverDash />,
//     sponsor: <SponsorDash />,
// }

// const renderByRole = (role) => {
//     return RolePages[role];
// }

// {renderByRole(rollState)}

