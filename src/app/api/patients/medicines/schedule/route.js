// app/api/patient/medicines/schedule/route.js
// Get today's medicine schedule
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    await dbConnect();
    const patient = await Patient.findById(auth.user._id);
    
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      );
    }

    const activeMedicines = patient.getActivePrescriptions();
    const todaySchedule = [];

    // Parse time slots and create schedule
    activeMedicines.forEach(med => {
      if (med.acceptedtime) {
        const timeSlots = parseTimeSlots(med.acceptedtime);
        timeSlots.forEach(slot => {
          todaySchedule.push({
            prescription_id: med._id,
            medicine_name: med.name,
            color: med.color,
            dosage: med.dosage,
            time_range: slot,
            scheduled_time: getMiddleTime(slot),
            dept: med.dept,
            doctor_name: med.doctor_name,
            instructions: med.instructions,
          });
        });
      }
    });

    // Sort by time
    todaySchedule.sort((a, b) => a.scheduled_time - b.scheduled_time);

    return NextResponse.json({
      success: true,
      data: todaySchedule,
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// Helper function to parse time slots
function parseTimeSlots(timeString) {
  // "5-9, 11-15, 17-22" -> [{start: 5, end: 9}, ...]
  const slots = timeString.split(',').map(slot => {
    const [start, end] = slot.trim().split('-').map(Number);
    return { start, end };
  });
  return slots;
}

// Helper function to get middle time of slot
function getMiddleTime(slot) {
  const today = new Date();
  const middleHour = Math.floor((slot.start + slot.end) / 2);
  today.setHours(middleHour, 0, 0, 0);
  return today;
}
