import './globals.css';

export const metadata = {
  title: 'Dashboard Next',
  description: 'Half-finished warehouse dashboard with Next',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
