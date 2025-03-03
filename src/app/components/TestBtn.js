"use client";

import { useState } from 'react';

export default function TestBtn() {
  const [status, setStatus] = useState(null);

  const handleTestProtectedRoute = async () => {
    try {
        const res = await fetch('/api/protected');
        const data = await res.json();
        console.log(data);
        if(res.ok) {
            setStatus('Success');
        } else {
            setStatus('Failed');
        }
    } catch (error) {
        console.error('Error checking protected route:', error);
        setStatus('Failed');
    }
  };

  return (
    <button onClick={handleTestProtectedRoute}>
        Test Protected Route {status && `: ${status}`}
    </button>
  );
}
