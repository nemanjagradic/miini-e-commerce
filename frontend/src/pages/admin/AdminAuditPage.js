import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { getAuditActionLabel } from "../../utils/auditLabels";
import Spinner from "../../UI/Spinner";

const AdminAuditPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
      });
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`${API_URL}/audit?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load audit log");
      setLogs(data.data || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, dispatch, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Audit log</h2>
          <p className="mt-1 text-sm text-darker/60">
            {total} entr{total === 1 ? "y" : "ies"}
          </p>
        </div>
        <form
          className="flex w-full max-w-md gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load();
          }}
        >
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search action, resource, or #id…"
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
          />
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : logs.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-darker/60">
            No audit entries yet.
          </p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-[#faf9f7] text-xs uppercase tracking-wide text-darker/50">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Who</th>
                <th className="px-4 py-3 font-medium">What</th>
                <th className="px-4 py-3 font-medium">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-black/5 last:border-0 hover:bg-[#faf9f7]/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-darker/70">
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {log.actor?.name || "—"}
                    </div>
                    <div className="text-xs text-darker/50">
                      {log.actor?.email || ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium" title={log.action}>
                      {getAuditActionLabel(log.action)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-darker/80">
                      {log.resourceType || "—"}
                    </span>
                    {log.resourceId && (
                      <span className="ml-1 font-mono text-xs text-darker/45">
                        #{String(log.resourceId).slice(-6)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-darker/60">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-black/10 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminAuditPage;
