import React from "react";
// import styles from "@styles/button.module.css";

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<CustomButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
   className="py-[12px] px-[20px] inline-block items-center justify-center bg-[#9E77ED] mt-[10px] text-white disabled:bg-gray-600 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
};
