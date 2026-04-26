// import React from "react";
// import logo from "../../../public/assets/images/logo.svg";
// import type { LogoProps } from "./Logo.type";

// export default function Logo({ logoConfig }: LogoProps) {
//   const {
//     link = "/",
//     maxWidth = "120px",
//     showlogo = true,
//     text,
//   } = logoConfig;

//   return (
//     <div className="flex items-center justify-center transition-all duration-300 overflow-hidden">
//       <a href={link}>
//         <img
//           src={logo}
//           alt="logo"
//           style={{ maxWidth }}
//           className="transition-all duration-300 object-contain"
//         />
//         {showlogo && text && (
//           <span className="ml-2 text-white font-semibold">{text}</span>
//         )}
//       </a>
//     </div>
//   );
// }


import React from "react";
import type { LogoProps } from "./Logo.type";

export default function Logo({ logoConfig }: LogoProps) {
  const {
    link = "/",
    maxWidth = "120px",
    showlogo = true,
    text,
  } = logoConfig;

  return (
    <div className="flex items-center justify-center transition-all duration-300 overflow-hidden">
      <a href={link} className="flex items-center">
        <img
          src="/assets/images/logo.svg"
          alt="logo"
          style={{ maxWidth }}
          className="transition-all duration-300 object-contain"
        />
        {showlogo && text && (
          <span className="ml-2 text-white font-semibold">{text}</span>
        )}
      </a>
    </div>
  );
}