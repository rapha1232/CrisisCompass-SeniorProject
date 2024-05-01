import { Map } from "@/components/Map/Map";

const RightSideBar = () => {
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Map</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          <Map />
        </div>
      </div>
      <div className="mt-16">
        {/* <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4"></div> */}
      </div>
    </section>
  );
};

export default RightSideBar;
