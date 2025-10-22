import { dbConnect } from "@/lib/dbConnect";
import Patient from "@/models/patient";
import Alert from "@/models/alert";
import { v4 as uuidv4 } from "uuid";

const ALERT_RULES = {
  high: { threshold: 2, type: "high" },
  medium: { high: 5, medium: 2 },
  low: { threshold: 5, type: "low" },
};

function genId() {
  const d = new Date().toISOString().split("T")[0].replace(/-/g, "");
  return `ALERT-${d}-${uuidv4().slice(0, 4).toUpperCase()}`;
}

async function shouldCreateMedicationAlert(patient, consecutiveMissed) {
  const level = patient.alert_status?.level || "low";
  switch (level) {
    case "high":
      return consecutiveMissed >= 2 ? { create: true, alertType: "high" } : { create: false };
    case "medium":
      if (consecutiveMissed >= 5) return { create: true, alertType: "high" };
      if (consecutiveMissed >= 2) return { create: true, alertType: "medium" };
      return { create: false };
    case "low":
      return consecutiveMissed >= 5 ? { create: true, alertType: "low" } : { create: false };
    default:
      return { create: false };
  }
}

export async function runMedicationAlertJob(io = null) {
  await dbConnect();
  const patients = await Patient.find({}).lean();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  for (const p of patients) {
    const intakes = p.medicine_intakes || [];
    const recent = [...intakes]
      .sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time))
      .slice(0, 15);

    // Count consecutive misses
    let consecutiveMissed = 0;
    for (const intake of recent) {
      if (intake.status === "missed") consecutiveMissed++;
      else break;
    }

    const rule = await shouldCreateMedicationAlert(p, consecutiveMissed);
    if (!rule.create) continue;

    // avoid duplicate in 24h
    const exists = await Alert.findOne({
      patient_id: p._id,
      category: "medication",
      createdAt: { $gte: since },
    });
    if (exists) continue;

    const alert = await Alert.create({
      alert_id: genId(),
      category: "medication",
      alert_type: rule.alertType,
      patient_id: p._id,
      patient_name: p.name,
      patient_phone: p.ph_number,
      medication_name: p.medicine_name,
      consecutive_missed: consecutiveMissed,
      total_missed: p.total_missed || 0,
    });

    // Real-time emit
    if (io) io.emit("new-alert", alert);
  }
}
