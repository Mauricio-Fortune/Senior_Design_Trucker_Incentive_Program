import React, { useState, useEffect } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';


export default function User() {

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes(); // Adjusted to get the user object directly
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