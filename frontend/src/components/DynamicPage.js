import React from "react";
import { motion } from "framer-motion";

const DynamicPage = ({ activePage, doctorContent, patientContent }) => {
  return (
    <div className="p-6 flex-1 overflow-auto">
      {activePage in doctorContent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {doctorContent[activePage]}
        </motion.div>
      )}
      {activePage in patientContent && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {patientContent[activePage]}
        </motion.div>
      )}
    </div>
  );
};

export default DynamicPage;
