import { withAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";

const ProtectedLayout = ({children, level}) => {
    useEffect(()=>{
        //check user type
        //router push if needed
    }, [])

    return (
        <Layout>
            {children}
        </Layout>
    )
}

export default withAuthenticator(ProtectedLayout);

// const RolePages = {
//     driver: <DriverDash />,
//     sponsor: <SponsorDash />,
// }

// const renderByRole = (role) => {
//     return RolePages[role];
// }

// {renderByRole(rollState)}