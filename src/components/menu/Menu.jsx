"use client"; 

import React, { useEffect, useState } from "react";
import styles from "./menu.module.css";
import MenuPosts from "../menuPosts/MenuPosts";
import MenuCategories from "../menuCategories/MenuCategories";

const getData = async () => {
  const res = await fetch(`${process.env.URL}/api/mostPopular`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const Menu = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>{"What's hot"}</h2>
      <h1 className={styles.title}>Most Popular</h1>
      <MenuPosts withImage={false} posts={posts} />
      <h2 className={styles.subtitle}>Discover by topic</h2>
      <h1 className={styles.title}>Category</h1>
      <MenuCategories />
      <h2 className={styles.subtitle}>Choosen by the editors</h2>
      <h1 className={styles.title}>Editors Pick</h1>
      <MenuPosts withImage={true} posts={posts} />
    </div>
  );
};

export default Menu;
