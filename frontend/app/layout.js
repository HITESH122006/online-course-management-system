import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Online Course Management System | MongoDB Atlas & Next.js",
  description:
    "Full-stack College Mini Project demonstrating MongoDB Atlas connectivity, Mongoose schema design, CRUD operations, and Aggregation pipelines.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-wrapper">{children}</main>
        <footer className="footer">
          <div className="footer-content">
            <p>
              <strong>Online Course Management System</strong> — TAE-2 Mini Project for Database Management Systems (DBMS) & Advanced Web Technology (AWT).
            </p>
            <p className="footer-sub">
              Tech Stack: Next.js 16 | Express.js | Node.js | MongoDB Atlas | Mongoose ODM
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
