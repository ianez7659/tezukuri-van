export default function AdminHome() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <a href="/admin/products" className="text-blue-500 hover:underline">
            Manage Products
          </a>
        </li>
        <li>
          <a href="/admin/events" className="text-blue-500 hover:underline">
            Manage Events
          </a>
        </li>
        <li>
          <a href="/admin/about" className="text-blue-500 hover:underline">
            Edit About Page
          </a>
        </li>
      </ul>
    </main>
  );
}
