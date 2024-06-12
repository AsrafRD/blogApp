import Image from "next/image";
import React from "react";
import Link from "next/link";
import styles from "./menuPosts.module.css";

const MenuPosts = ({ withImage, posts }) => {
  return (
    <div className={styles.items}>
      {posts.map((post) => (
        <Link href={`/blog?cat=${post.catSlug}`} className={styles.item} key={post._id}>
          {withImage && (
            <div className={styles.imgContainer}>
              <Image
                src={post.user?.image || "/default.jpg"}
                alt={post.title}
                fill
                className={styles.image}
              />
            </div>
          )}
          <div className={styles.txtContainer}>
            <h3 className={styles.posTitle}>{post.title}</h3>
            <div className={styles.detail}>
              <span className={`${styles.category} ${styles[post.catSlug]}`}>
                {post.catSlug || "Uncategorized"}
              </span>
              <span className={styles.username}> {post.user?.name}</span>
              <span className={styles.date}>
                {" "}
                - {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPosts;
