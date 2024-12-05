import Image from "next/image";
export default function SignupHeader() {
  return (
    <header>
      <h1>
        <Image
          src="/images/logo-full.svg"
          width={480}
          height={200}
          alt="Dreamer"
        ></Image>
      </h1>
    </header>
  );
}
