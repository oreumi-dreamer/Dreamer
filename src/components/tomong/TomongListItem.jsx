import { DREAM_MOODS, DREAM_GENRES } from "@/utils/constants";

export default function TomongListItem({
  dream,
  theme,
  selectedDream,
  handleRadioChange,
  styles,
}) {
  let tomongStampUrl = "/images/tomong-stamp.png";

  if (
    theme === "dark" ||
    (theme === "device" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    tomongStampUrl = "/images/tomong-stamp-dark.png";
  }

  return (
    <li key={dream.id}>
      <label>
        <input
          type="radio"
          name="dream"
          value={dream.id}
          checked={selectedDream?.id === dream.id}
          onChange={() => handleRadioChange(dream)}
          tabIndex={0}
        />
        <p>{dream.title}</p>
        <p>{new Date(dream.createdAt).toLocaleString("ko-KR")}</p>
        {dream.isTomong && (
          <img
            src={tomongStampUrl}
            className={styles["tomong-stamp"]}
            alt="해몽이 존재함"
          />
        )}
        <p>{dream.content}</p>
        {dream.dreamGenres.length > 0 && (
          <ul className={styles["post-tag"]}>
            {dream.dreamGenres.map((tag, index) => (
              <li
                key={index}
                style={
                  theme === "light" ||
                  (theme === "deviceMode" &&
                    window.matchMedia("(prefers-color-scheme: light)").matches)
                    ? {
                        backgroundColor: `${DREAM_GENRES.find((genre) => genre.id === tag).lightColor.hex}`,
                        color:
                          `${DREAM_GENRES.find((genre) => genre.id === tag).lightColor.textColor}` &&
                          `${DREAM_GENRES.find((genre) => genre.id === tag).lightColor.textColor}`,
                      }
                    : {
                        backgroundColor: `${DREAM_GENRES.find((genre) => genre.id === tag).darkColor.hex}`,
                        color:
                          `${DREAM_GENRES.find((genre) => genre.id === tag).darkColor.textColor}` &&
                          `${DREAM_GENRES.find((genre) => genre.id === tag).darkColor.textColor}`,
                      }
                }
              >
                {`${DREAM_GENRES.find((genre) => genre.id === tag).text}`}
              </li>
            ))}
          </ul>
        )}
        {dream.dreamMoods.length > 0 && (
          <span className={styles["dream-felt"]}>
            {`(${dream.dreamMoods.map((mood1) => `${DREAM_MOODS.find((mood) => mood.id === mood1).text}`).join(", ")})`}
          </span>
        )}
      </label>
    </li>
  );
}
