import styles from "./Controls.module.css";

export function Button({ highlight, children, type, onClick, float }) {
  let buttonClass;

  buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  if (float === "left-bottom") {
    buttonClass = `${buttonClass} ${styles["button-left-bottom"]}`;
  }

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}

export function ButtonLabel({ highlight, children, htmlFor }) {
  const buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  return (
    <label htmlFor={htmlFor} className={buttonClass}>
      {children}
    </label>
  );
}

export function Input({ type, value, onChange, background }) {
  let inputClass = styles["input"];
  if (type === "text" || type === "password" || type === "email") {
    inputClass = styles["input-text"];
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={inputClass}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    />
  );
}

export function Textarea({ value, maxLength, onChange, background }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={styles["textarea"]}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    />
  );
}

export function Select({
  id,
  name,
  onChange,
  value,
  required,
  children,
  background,
}) {
  return (
    <select
      id={id}
      name={name}
      onChange={onChange}
      value={value}
      required={required}
      className={styles["select"]}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    >
      {children}
    </select>
  );
}

export function Checkbox({ type, background, value, onChange, children }) {
  if (type === "col") {
    return (
      <label className={styles["checkbox-col"]}>
        <input
          type="checkbox"
          value={value}
          onChange={onChange}
          className={styles["checkbox"]}
          style={background === "white" ? { backgroundColor: "white" } : {}}
        />
        {children}
      </label>
    );
  } else {
    return (
      <input
        type="checkbox"
        value={value}
        onChange={onChange}
        className={styles["checkbox"]}
        style={bg === "white" ? { backgroundColor: "white" } : {}}
      />
    );
  }
}

export function LoginForm({ onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className={styles["login-form"]}>
      {children}
    </form>
  );
}
