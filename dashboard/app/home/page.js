"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

const columns = ["Letter", "Font", "Background", "Decor", "From", "Device"];

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalDownloads: 0,
    monthlyUsers: 0,
    totalUsers: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const statsRes = await fetch("/api/stats");
        const historyRes = await fetch("/api/history");

        // Not logged in (anymore): back to the login page
        if (statsRes.status === 401 || historyRes.status === 401) {
          router.push("/");
          return;
        }

        const statsData = await statsRes.json();
        const historyData = await historyRes.json();

        if (statsData.success && historyData.success) {
          setStats(statsData.stats);
          setHistory(historyData.history);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }

      setLoading(false);
    };

    getData();

    // Realtime: ask the server for new data every 5 seconds
    const timer = setInterval(getData, 5000);
    return () => clearInterval(timer);
  }, [router]);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-6 md:py-10">
        <header className="flex items-center justify-between">
          <p className="text-sm font-semibold">Morpli PFP</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              Log out
            </button>
          </div>
        </header>

        <section className="mt-12 md:mt-16">
          <h1 className="text-sm text-muted-foreground">Total PFP downloads</h1>
          <p className="mt-2 text-6xl font-semibold tracking-tight tabular-nums md:text-7xl">
            {loading ? "–" : stats.totalDownloads.toLocaleString("en-US")}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-2 border-y border-border">
          <div className="py-5 pr-4">
            <h2 className="text-sm text-muted-foreground">Monthly users</h2>
            <p className="mt-1 text-2xl font-semibold tabular-nums md:text-3xl">
              {loading ? "–" : stats.monthlyUsers.toLocaleString("en-US")}
            </p>
          </div>
          <div className="border-l border-border py-5 pl-4 md:pl-6">
            <h2 className="text-sm text-muted-foreground">Total users</h2>
            <p className="mt-1 text-2xl font-semibold tabular-nums md:text-3xl">
              {loading ? "–" : stats.totalUsers.toLocaleString("en-US")}
            </p>
          </div>
        </section>

        <section className="mt-12 md:mt-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Download history</h2>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                Can&apos;t reach the server. Retrying...
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className="size-2 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Live
              </p>
            )}
          </div>

          {/* -mx-6 px-6: tabel bisa digeser sampai ujung layar di mobile */}
          <div className="-mx-6 mt-4 overflow-x-auto px-6">
            <table className="w-full min-w-xl text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap py-3 pr-6 font-medium"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id} className="border-b border-border">
                    <td className="py-3 pr-6 font-semibold">{item.letter}</td>
                    <td className="whitespace-nowrap py-3 pr-6">{item.font}</td>
                    <td className="whitespace-nowrap py-3 pr-6">
                      {item.background}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-6">{item.decor}</td>
                    <td className="whitespace-nowrap py-3 pr-6">{item.from}</td>
                    <td className="whitespace-nowrap py-3 pr-6">{item.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && history.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No downloads yet. New downloads will show up here.
            </p>
          )}
        </section>
      </main>

      <footer className="mx-auto w-full max-w-4xl px-6 pb-8">
        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Morpli. All rights reserved.
        </p>
      </footer>
    </>
  );
}
