import Image from "next/image";

export const Loading = () => {
  return (
    <main className="flex w-full h-screen items-center justify-center bg-dark-300 select-none">
      <Image
        priority
        src={"/assets/icons/logo.svg"}
        alt="logo"
        width={200}
        height={200}
        className="animate-spin duration-3000 m-auto select-none"
      />
    </main>
  );
};
