import Image from "next/image";
import styles from "./styles.module.scss";

interface RecognitionCardProps {
  title: string;
  imageSrc: string;
  isLastItem?: boolean;
  isResponsive?: boolean;
}

const RecognitionCard: React.FC<RecognitionCardProps> = ({
  title,
  imageSrc,
  isLastItem = false,
  isResponsive,
}) => {
  return (
    <div
      className={`${styles.recognitionCard} ${
        isLastItem ? styles.noBorder : ""
      } ${isResponsive ? styles.noBorder : ""}`}
      style={{ width: "9.625rem" }}
    >
      <div className={styles.image}>
        <Image src={imageSrc} alt={title} width={80} height={80} />
      </div>
      <p className={styles.title} title={title}>
        {title}
      </p>
    </div>
  );
};

export default RecognitionCard;
