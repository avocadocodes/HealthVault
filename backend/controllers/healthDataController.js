
const HealthData = require("../models/HealthData");

exports.getHealthData = async (req, res) => {
  const { patientId } = req.params;
  try {
    const data = await HealthData.find({ patient: patientId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addHealthData = async (req, res) => {
  const { patient, metricType, value } = req.body;
  try {
    const healthData = new HealthData({ patient, metricType, value });
    await healthData.save();
    res.status(201).json(healthData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
                