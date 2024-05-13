import OngoingEmergencies from "./OngoingEmergencies";

type Props = {};

const MapsRightSidebarContent = (props: Props) => {
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="h-full">
        <h3 className="h3-bold text-dark200_light900 mb-2">Descriptions</h3>
        <div className="flex size-full flex-col gap-[30px]">
          <OngoingEmergencies descriptions />
        </div>
      </div>
    </section>
  );
};

export default MapsRightSidebarContent;
