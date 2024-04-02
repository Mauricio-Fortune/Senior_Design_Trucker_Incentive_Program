import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

export default function User() {

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await getCurrentUser(); // Adjusted to get the user object directly
        // console.log(`The username: ${user.username}`);
        // console.log(`The userId: ${user.attributes.sub}`); // Assuming the userId is in the attributes
        // // signInDetails structure depends on the specifics of your setup
        // console.log(`The signInDetails: ${user.signInUserSession}`); // Example path, adjust according to your structure
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <p>Hi</p>
  );
}