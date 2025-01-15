
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const healthDataRoutes = require("./routes/healthDataRoutes");
const bookingRequestsRoutes = require("./routes/bookingRequestsRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const userRoutes = require("./routes/usersRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/health-data", healthDataRoutes);
app.use("/api/booking-requests", bookingRequestsRoutes);
app.use("/api/calendar-events", calendarRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                