import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

// ─── Sidebar / Nav ────────────────────────────────────────────────────────────

export function LogoIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8zm6-3.5a.5.5 0 0 0-.5.5v3.25l-1.6 1.6a.5.5 0 0 0 .71.71l1.75-1.75A.5.5 0 0 0 8.5 8.5V5a.5.5 0 0 0-.5-.5z" />
    </svg>
  );
}

export function DashboardIcon({ className, ...rest }: IconProps) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="currentColor" className={className} {...rest}>
      <path d="M9.62825 5.8655V0H17V5.8655H9.62825ZM0 8.87825V0H7.37175V8.87825H0ZM9.62825 17V8.12175H17V17H9.62825ZM0 17V11.1345H7.37175V17H0ZM1.2565 7.62175H6.1155V1.2565H1.2565V7.62175ZM10.8845 15.7435H15.7435V9.37825H10.8845V15.7435ZM10.8845 4.609H15.7435V1.2565H10.8845V4.609ZM1.2565 15.7435H6.1155V12.391H1.2565V15.7435Z" />
    </svg>
  );
}

export function ComposeIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2.5a.5.5 0 0 1 .5.5v3.79l2.35 2.35a.5.5 0 0 1-.71.71L7.65 8.36A.5.5 0 0 1 7.5 8V4a.5.5 0 0 1 .5-.5z" />
    </svg>
  );
}

export function BundlesIcon({ className, ...rest }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package h-4 w-4">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
      <path d="M12 22V12"></path>
      <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path>
      <path d="m7.5 4.27 9 5.15"></path>
    </svg>
  );
}

export function CohortsIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M7 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM1 3.5a6 6 0 1 1 9.9 4.57A5.5 5.5 0 0 1 14.5 13H13a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4H-.5a5.5 5.5 0 0 1 4.6-5.43A5.97 5.97 0 0 1 1 3.5z" />
    </svg>
  );
}

export function CampaignsIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M13 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM5 6h6v1H5V6zm0 2.5h4v1H5v-1z" />
    </svg>
  );
}

export function CatalogueIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M2 2.5A.5.5 0 0 1 2.5 2h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 2.5zm2 3A.5.5 0 0 1 4.5 5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 5.5zm2 3A.5.5 0 0 1 6.5 8h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 8.5z" />
    </svg>
  );
}

export function InventoryIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M2 3h12v2l-1.5 1L14 7.5V13H2V7.5L3.5 6 2 5V3zm1 1v.72l1.5 1L6 4.72V4H3zm4 0v.72l1.5 1L10 4.72V4H7zm4 0v.72l1.5 1V4h-1.5z" />
    </svg>
  );
}

export function EcosystemIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 2a5 5 0 0 1 4.33 7.5H3.67A5 5 0 0 1 8 3zM5.5 12h5l-2.5 2-2.5-2z" />
    </svg>
  );
}

export function OrdersIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v1h8V4H4zm0 3v1h8V7H4zm0 3v1h5v-1H4z" />
    </svg>
  );
}

export function SitaIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M8 1l7 4v6l-7 4-7-4V5l7-4zm0 2.24L3 6.12V9.88L8 12.76l5-2.88V6.12L8 3.24z" />
    </svg>
  );
}

export function AnalyticsIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M2 2h2v12H2V2zm3 4h2v8H5V6zm3-2h2v10H8V4zm3 3h2v7h-2V7z" />
    </svg>
  );
}

export function OffersIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M2 2.5A.5.5 0 0 1 2.5 2h4.086a.5.5 0 0 1 .353.146l6.5 6.5a.5.5 0 0 1 0 .708l-4.086 4.086a.5.5 0 0 1-.708 0l-6.5-6.5A.5.5 0 0 1 2 6.586V2.5zm2 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  );
}

export function ChevronIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" {...rest}>
      <path d="M4.5 2 8 6l-3.5 4" />
    </svg>
  );
}

export function ChevronDownIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" {...rest}>
      <path d="M2 4.5 6 8l4-3.5" />
    </svg>
  );
}

// ─── Page / Feature Icons ─────────────────────────────────────────────────────

export function PlusIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm1 5V5.5a1 1 0 0 0-2 0V7H5.5a1 1 0 0 0 0 2H7v1.5a1 1 0 0 0 2 0V9h1.5a1 1 0 0 0 0-2H9z" />
    </svg>
  );
}

export function SearchIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-.7 4.2 2.8 2.8-1.1 1.1-2.8-2.8a5.5 5.5 0 1 1 1.1-1.1z" />
    </svg>
  );
}

export function CalendarIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M4 1a1 1 0 0 0-1 1v1H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-1V2a1 1 0 0 0-2 0v1H5V2a1 1 0 0 0-1-1zM3 6h10v7H3V6z" />
    </svg>
  );
}

export function UserIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <path d="M8 1a3.5 3.5 0 1 0 0 7A3.5 3.5 0 0 0 8 1zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" />
    </svg>
  );
}

export function DotsIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" {...rest}>
      <circle cx="8" cy="3" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="8" cy="13" r="1.2" />
    </svg>
  );
}

export function SettingsIcon({ className, ...rest }: IconProps) {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="currentColor" className={className} {...rest}>
      <path d="M7.08825 19L6.7075 15.9538C6.43967 15.8641 6.165 15.7385 5.8835 15.577C5.60217 15.4153 5.35058 15.2423 5.12875 15.0577L2.3075 16.25L0 12.25L2.44025 10.4058C2.41725 10.2571 2.40092 10.1077 2.39125 9.95775C2.38158 9.80775 2.37675 9.65833 2.37675 9.5095C2.37675 9.36733 2.38158 9.22283 2.39125 9.076C2.40092 8.92917 2.41725 8.76858 2.44025 8.59425L0 6.75L2.3075 2.76925L5.119 3.952C5.36017 3.761 5.61758 3.58633 5.89125 3.428C6.16492 3.26967 6.43383 3.14242 6.698 3.04625L7.08825 0H11.7037L12.0845 3.05575C12.3845 3.16475 12.6559 3.292 12.8987 3.4375C13.1417 3.583 13.387 3.7545 13.6345 3.952L16.4845 2.76925L18.792 6.75L16.3133 8.623C16.3491 8.7845 16.3687 8.9355 16.372 9.076C16.3752 9.21633 16.3767 9.35767 16.3767 9.5C16.3767 9.63583 16.3735 9.774 16.367 9.9145C16.3607 10.0548 16.3377 10.2154 16.298 10.3963L18.7575 12.25L16.4498 16.25L13.6345 15.048C13.387 15.2455 13.1344 15.4202 12.8767 15.572C12.6191 15.724 12.355 15.8481 12.0845 15.9443L11.7037 19H7.08825ZM8.396 17.5H10.3615L10.721 14.8212C11.2313 14.6879 11.6977 14.4985 12.12 14.253C12.5425 14.0073 12.9499 13.6916 13.3422 13.3057L15.8267 14.35L16.8115 12.65L14.6422 11.0155C14.7256 10.7565 14.7823 10.5026 14.8123 10.2537C14.8424 10.0051 14.8575 9.75383 14.8575 9.5C14.8575 9.23967 14.8424 8.98842 14.8123 8.74625C14.7823 8.50392 14.7256 8.25642 14.6422 8.00375L16.8305 6.35L15.846 4.65L13.3325 5.7095C12.9978 5.35183 12.5969 5.03583 12.1297 4.7615C11.6624 4.48717 11.1897 4.29292 10.7115 4.17875L10.396 1.5H8.4115L8.0805 4.16925C7.57033 4.28975 7.09925 4.47433 6.66725 4.723C6.23508 4.97183 5.82283 5.29233 5.4305 5.6845L2.946 4.65L1.9615 6.35L4.121 7.9595C4.03767 8.19683 3.97933 8.44367 3.946 8.7C3.91267 8.95633 3.896 9.22617 3.896 9.5095C3.896 9.76983 3.91267 10.025 3.946 10.275C3.97933 10.525 4.0345 10.7718 4.1115 11.0155L1.9615 12.65L2.946 14.35L5.421 13.3C5.8005 13.6897 6.20625 14.0089 6.63825 14.2578C7.07042 14.5064 7.548 14.6974 8.071 14.8307L8.396 17.5ZM9.4075 12.5C10.2395 12.5 10.9475 12.208 11.5315 11.624C12.1155 11.04 12.4075 10.332 12.4075 9.5C12.4075 8.668 12.1155 7.96 11.5315 7.376C10.9475 6.792 10.2395 6.5 9.4075 6.5C8.56517 6.5 7.85458 6.792 7.27575 7.376C6.69692 7.96 6.4075 8.668 6.4075 9.5C6.4075 10.332 6.69692 11.04 7.27575 11.624C7.85458 12.208 8.56517 12.5 9.4075 12.5Z" />
    </svg>
  );
}


export function ChevronDownSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4.5 6 8l4-3.5" />
    </svg>
  );
}

export function DotsHorizontal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <circle cx="3" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="13" cy="8" r="1.2" />
    </svg>
  );
}

export function IconCollapse({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="10,4 6,8 10,12" />
    </svg>
  );
}

export function IconExpand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,4 10,8 6,12" />
      {/* <line x1="12" y1="4" x2="12" y2="12" /> */}
    </svg>
  );
}

export function ExpandIcon(props: IconProps) {
  const { className, ...rest } = props;

  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      className={className}
      {...rest}
    >
      <path
        d="M3.37464 6.75048H5.74964V9.12548C5.74964 9.19423 5.80589 9.25048 5.87464 9.25048H6.62464C6.69339 9.25048 6.74964 9.19423 6.74964 9.12548V6.75048H9.12464C9.19339 6.75048 9.24964 6.69422 9.24964 6.62547V5.87547C9.24964 5.80672 9.19339 5.75047 9.12464 5.75047H6.74964V3.37547C6.74964 3.30672 6.69339 3.25047 6.62464 3.25047H5.87464C5.80589 3.25047 5.74964 3.30672 5.74964 3.37547V5.75047H3.37464C3.30589 5.75047 3.24964 5.80672 3.24964 5.87547V6.62547C3.24964 6.69422 3.30589 6.75048 3.37464 6.75048Z"
        fill="currentColor"
      />
      <path
        d="M12 0H0.5C0.223438 0 0 0.223438 0 0.5V12C0 12.2766 0.223438 12.5 0.5 12.5H12C12.2766 12.5 12.5 12.2766 12.5 12V0.5C12.5 0.223438 12.2766 0 12 0ZM11.375 11.375H1.125V1.125H11.375V11.375Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function UnExpandIcon(props: IconProps) {
  const { className, ...rest } = props;

  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} {...rest}>
      <path d="M3.37464 6.75048H9.12464C9.19339 6.75048 9.24964 6.69422 9.24964 6.62547V5.87547C9.24964 5.80672 9.19339 5.75047 9.12464 5.75047H3.37464C3.30589 5.75047 3.24964 5.80672 3.24964 5.87547V6.62547C3.24964 6.69422 3.30589 6.75048 3.37464 6.75048Z" fill="currentColor"></path>
      <path d="M12 0H0.5C0.223438 0 0 0.223438 0 0.5V12C0 12.2766 0.223438 12.5 0.5 12.5H12C12.2766 12.5 12.5 12.2766 12.5 12V0.5C12.5 0.223438 12.2766 0 12 0ZM11.375 11.375H1.125V1.125H11.375V11.375Z" fill="currentColor"></path>
    </svg>
  );
}

export function ListIcon (){
  return(
    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="5" rx="1"/>
      <rect x="2" y="10" width="20" height="5" rx="1"/>
      <rect x="2" y="17" width="20" height="5" rx="1"/>
      <circle cx="18" cy="5.5"  r="1" fill="currentColor"/>
      <circle cx="18" cy="12.5" r="1" fill="currentColor"/>
      <circle cx="18" cy="19.5" r="1" fill="currentColor"/>
    </svg>
  );
}

export const Arrow = () => {
  return (
     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
  );
};

export const LightningIcon = ({ className = "w-4 h-4 text-emerald-500" }) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ClockIcon = ({ className = "w-4 h-4 text-blue-400" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
};

export const GridIcon = ({ className = "w-4 h-4 text-blue-500" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
    </svg>
  );
};
export const WarningIcon = ({ className = "w-4 h-4 text-red-500" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
};

export const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#7C3AED" strokeWidth="1.5" />
    <path
      d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z"
      stroke="#7C3AED"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#16A34A" strokeWidth="1.5" />
    <path
      d="M8 12l3 3 5-5"
      stroke="#16A34A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SyncIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c-1.66 0-3-4.03-3-9s1.34-9 3-9m0 18c1.66 0 3-4.03 3-9s-1.34-9-3-9m-9 9a9 9 0 0 1 9-9"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M12 7v5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="0.75" fill="#DC2626" />
  </svg>
);