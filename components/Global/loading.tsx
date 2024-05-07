import Image from "next/image";

export const Loading = () => {
  return (
    <main className="flex h-screen w-full select-none items-center justify-center bg-dark-300">
      <Image
        priority
        src={"/assets/icons/logo.svg"}
        alt="logo"
        width={200}
        height={200}
        className="m-auto animate-spin select-none duration-3000"
      />
    </main>
  );
};
