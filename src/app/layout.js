import "./globals.css";

export const metadata = {
    title: "Zero Cost Medium",
    description: "Premium publishing platform, hosted for free.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
