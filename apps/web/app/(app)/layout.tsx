// TODO: Implement app layout with navigation, sidebar, etc.
// TODO: Add authentication check (redirect to login if not authenticated)
// TODO: Load household context
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Navigation will be implemented here */}
      <main>{children}</main>
    </div>
  )
}
