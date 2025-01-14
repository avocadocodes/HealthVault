exports.getPatientById = async (req, res) => {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);
  
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      res.status(200).json(patient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch patient details." });
    }
  };
  