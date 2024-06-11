"use client";

import Menu from "@/components/menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import { useRouter } from "next/navigation";

const getData = async (slug) => {
  const res = await fetch(`${process.env.URL}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const SinglePage = async ({ params }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`${process.env.URL}/api/posts/${slug}`, {
      method: "DELETE",
    });

    if (res.status === 204) {
      router.push("/");
    } else {
      // Handle error
    }
  };

  const handleUpdate = () => {
    // Navigate to update page
    router.push(`/edit/${slug}`);
  };
  const { slug } = params;

  const data = await getData(slug);
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.title}</h1>
          <div className={styles.user}>
            <div className={styles.userImageContainer}>
              {data?.user && (
                <Image
                  src={data.user.image}
                  alt=""
                  fill
                  className={styles.avatar}
                />
              )}
            </div>
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data.user.name}</span>
              <span className={styles.date}>
                {data.createdAt.substring(0, 10)}
              </span>
            </div>
            <div className={styles.actions}>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div className={styles.read}>
            {data.views} Reading<i className="fi fi-br-eye"></i>
          </div>
          <div
            className={styles.desc}
            dangerouslySetInnerHTML={{ __html: data?.desc}}
          />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
