
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";

export const metadata = {
  title: "Blog Management System",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
     
          <AntdRegistry>
              {children}
          </AntdRegistry>
      </body>
    </html>
  );
}
