import React from "react";

function Authlayout({ children }) {
  return (
    <div
      style={{
        height: "130vh",
        backgroundImage:
          "linear-gradient(-45deg, var(--secondaryColor), white)",
      }}
    >
      {children}
    </div>
  );
}

export default Authlayout;