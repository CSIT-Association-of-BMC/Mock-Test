import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t text-center py-3 text-gray-500 text-sm">
      <span>
        &copy; {new Date().getFullYear()} Consolesoft. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
