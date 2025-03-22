import Image from "next/image";
import icon from "../../app/icon.png";
export default function Nav() {
  return (
    <div className="fix left-0 top-2 bg-[#F4EBFF] p-4">
      <div className="flex flex-row">
        <Image height={30} width={30} src={icon} alt="icon" />
        <p className="text-xl font-bold text-[#1D2939]">TripPlanner</p>
      </div>
    </div>
  );
}
