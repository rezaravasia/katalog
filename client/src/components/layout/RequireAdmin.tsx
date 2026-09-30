import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../../lib/api";
import { queryKeys } from "../../lib/queries";
export function RequireAdmin() { const { isLoading, isError } = useQuery({ queryKey: queryKeys.me, queryFn: api.me, retry: false, staleTime: 5 * 60_000 }); if (isLoading) return <p className="grid min-h-screen place-items-center text-sm text-gray-500">Memeriksa sesi admin…</p>; return isError ? <Navigate to="/admin/login" replace/> : <Outlet/>; }
