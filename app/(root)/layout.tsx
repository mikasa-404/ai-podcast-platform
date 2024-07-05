export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <p className="text-white-1"> left sidebar</p>
        {children}
        <p className="text-white-1">right sidebar</p>
      </main>
    </div>
  );
}
