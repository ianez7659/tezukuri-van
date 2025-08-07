"use client";

import { useUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { PackageCheckIcon, Calendar1, BookOpenCheck } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;

  if (!user) redirect("/admin/login");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <ul className="space-y-2">
        <li>
          <Link
            href="/admin/products"
            className="flex gap-2 items-center text-2xl hover:bg-black hover:text-white px-2 py-2 rounded"
          >
            <PackageCheckIcon size={25} /> Manage Product Page
          </Link>
        </li>
        <li>
          <Link
            href="/admin/events"
            className="flex gap-2 items-center text-2xl hover:bg-black hover:text-white px-2 py-2 rounded"
          >
            <Calendar1 size={25} /> Manage Events Page
          </Link>
        </li>
        <li>
          <Link
            href="/admin/about"
            className="flex gap-2 items-center text-2xl hover:bg-black hover:text-white px-2 py-2 rounded"
          >
            <BookOpenCheck size={25} /> Manage About Page
          </Link>
        </li>
      </ul>

      <button
        onClick={() => {
          localStorage.clear(); // optional
          supabase.auth.signOut();
        }}
        className="mt-6 border px-4 rounded-sm py-2 text-sm text-black cursor-pointer hover:bg-black hover:text-white transition"
      >
        Log out
      </button>
    </main>
  );
}
