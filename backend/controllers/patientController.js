const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      issue,
      medicines,
      status
    } =req.body;
    console.log(req.body)
    const id=req.user._id
    const patient = new Patient({user:id,name,age,gender,issue,medicines,status});
    await patient.save();
    res.status(201).json({patient:patient});
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const patients = await Patient.find({ user: decoded.id });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (patient.user.toString() !== decoded.id) {
      return res.status(403).json({ error: "You are not authorized to edit this patient" });
    }
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({patient: updatedPatient});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    if (patient.user.toString() !== decoded.id) {
      return res.status(403).json({ error: "You are not authorized to delete this patient" });
    }
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
