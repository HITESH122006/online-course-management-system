import "./globals.css";

export const metadata = {
  title: "Online Course Management System",
  description: "Online Course Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}