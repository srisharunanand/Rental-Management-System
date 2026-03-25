import type { Metadata } from "next";
import "../styles/globals.css"; // Double check: is the file name 'globals.css' or 'global.css'?

export const metadata: Metadata = {
  title: "Rental Management System",
  description: "Modern property management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}