import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
const getData = async () => {
  const res = await fetch(`${process.env.URL}/api/carrousel`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const Featured = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b className={styles.bold}>Hey, everyone!</b> Discover stories and
        creative ideas.
      </h1>
      {data && (
        <div className={styles.post} key={data._id}>
          {data.img && (
            <div className={styles.imgContainer}>
              <Image src={data.img} alt="" fill className={styles.image} />
            </div>
          )}
          <div className={styles.textContainer}>
            <h1 className={styles.postTitle}>
              {data.title}
            </h1>
            <div className={styles.postDesc} dangerouslySetInnerHTML={{ __html: data?.desc.length > 850 ? `${data?.desc.substring(0, 686)}...` : data?.desc }} />
            <button href={`/posts/${data.slug}`} className={styles.button}>Read More</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;