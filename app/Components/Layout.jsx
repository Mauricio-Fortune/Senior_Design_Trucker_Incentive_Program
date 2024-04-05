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