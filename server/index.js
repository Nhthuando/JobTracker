import "dotenv/config";
import express from 'express';
import authRouter from "./routes/authRoute.js";
import jobRouter from "./routes/jobRoute.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;  // ✅ dynamic port cho Render

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://job-tracker-theta-one.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.use("/api/auth/", authRouter);
app.use("/api/jobs/", jobRouter);

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`=========================================`);
});