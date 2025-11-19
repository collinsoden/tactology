import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Departments Admin',
  description: 'JWT-protected departments management UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
