import { withAuthenticator } from "@aws-amplify/ui-react";
import React, { useEffect } from "react";
import Layout from "./Layout";

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