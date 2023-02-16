import Link from "next/link";
import React from "react";

function DropdownLink(props) {
  const { href, logout, children, ...rest } = props;

  return (
    <Link
      className="flex hover:bg-gray-300 p-2 rounded-t-sm rounded-b-sm "
      href={href}
      onClick={() => {
        if (logout) logout();
      }}
    >
      {children}
    </Link>
  );
}

export default DropdownLink;
