import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "For you!",
  description: "Something I made while waiting for you.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${quicksand.className} select-none antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
