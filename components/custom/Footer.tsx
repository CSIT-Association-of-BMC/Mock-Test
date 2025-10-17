import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t text-center py-3 text-gray-500 text-sm">
      <span>
        &copy; {new Date().getFullYear()} CSIT Association of BMC. All rights
        reserved.
      </span>
      <br />
      <span>
        Powered by{" "}
        <a className="text-blue-400" href="https://consolesoft.ltd">
          {" "}
          Console.soft
        </a>
      </span>
    </footer>
  );
};

export default Footer;
