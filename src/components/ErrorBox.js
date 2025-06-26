'use client';

import React from 'react';

export default function ErrorBox({ message }) {
  return (
    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md">
      {message}
    </div>
  );
}
