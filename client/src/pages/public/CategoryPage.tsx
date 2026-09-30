import { Navigate, useParams } from "react-router-dom";
import { CatalogPage } from "./CatalogPage";
export function CategoryPage() { const { slug } = useParams(); return slug ? <CatalogPage forcedCategory={slug}/> : <Navigate to="/" replace/>; }
