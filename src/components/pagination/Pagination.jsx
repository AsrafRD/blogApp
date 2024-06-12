"use client";

import React from "react";
import styles from "./pagination.module.css";
import { useRouter } from "next/navigation";

const Pagination = ({ page, hasPrev, hasNext, totalPages }) => {
  const router = useRouter();

  const pageButtons = [];
  const visiblePages = 1;

  const renderDots = () => {
    return <span className={styles.dots}>...</span>;
  };

  for (let i = 1; i <= totalPages; i++) {
    // Menampilkan angka pertama dan terakhir
    if (i === 1 || i === totalPages) {
      pageButtons.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${
            page === i ? styles.currentPage : ""
          }`}
          onClick={() => router.push(`?page=${i}`)}
        >
          {i}
        </button>
      );
    }
    // Menampilkan angka sekitar halaman saat ini
    else if (
      i >= page - visiblePages &&
      i <= page + visiblePages &&
      i !== 1 &&
      i !== totalPages
    ) {
      pageButtons.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${
            page === i ? styles.currentPage : ""
          }`}
          onClick={() => router.push(`?page=${i}`)}
        >
          {i}
        </button>
      );
    }
    // Menampilkan tanda elipsis sebelum atau setelah angka pertama atau terakhir
    else if (
      (i === page - visiblePages - 1 && page !== 1) ||
      (i === page + visiblePages + 1 && page !== totalPages)
    ) {
      pageButtons.push(renderDots());
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => router.push(`?page=${page - 1}`)}
      >
        {"<"}
      </button>
      {pageButtons}
      <button
        className={styles.button}
        disabled={!hasNext}
        onClick={() => router.push(`?page=${page + 1}`)}
      >
        <i class="fi fi-sr-angle-small-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
