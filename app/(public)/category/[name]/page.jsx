// app/category/[name]/page.jsx
'use client';

import React from "react";
import { useParams } from "next/navigation";
import CategoryProducts from "@/components/Categoryproducts";
import CategoryProductsFilter from "@/components/CategoryProductsFilter";

export default function CategoryPage() {
  const { name } = useParams();

  // Decode URL parameter (handles %20 for spaces and other encoded characters)
  const decodedCategoryName = decodeURIComponent(name || "");

  return (
    <div>
      {/* Pass category name to the reusable component */}
      {decodedCategoryName === "products" ? (
        <CategoryProductsFilter categoryName={decodedCategoryName} />
      ) : (
        <CategoryProducts categoryName={decodedCategoryName} />
      )}
    </div>
  );
}
