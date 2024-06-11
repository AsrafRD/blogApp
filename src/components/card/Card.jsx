import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";

const Card = ({ key, item }) => {
  return (
    <div className={styles.container} key={key}>
      <div className={styles.txtContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
        </Link>
        <div className={styles.postDesc} dangerouslySetInnerHTML={{ __html: item?.desc.length > 640 ? `${item?.desc.substring(0, 640)}...` : item?.desc }} />
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
      {item.img && (
        <div className={styles.imgContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
    </div>
  );
};

export default Card;
