import "./globals.css";

export const metadata = {
    title: "Zero Cost Medium",
    description: "Premium publishing platform, hosted for free.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
            </head>
            <body className="antialiased">
                {children}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", user => {
                  if (!user) {
                    window.netlifyIdentity.on("login", () => {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
            `,
                    }}
                />
            </body>
        </html>
    );
}
