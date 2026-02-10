import ImportLog from "../models/ImportLog.js";

export const getImportHistory = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch import history" });
  }
};
