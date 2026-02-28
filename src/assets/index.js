function calculate_neuro_interface_values({
    rmssd,
    sdnn,
    resp_rate,
    spo2,
    heart_rate,
    sensitivity = 1.0,
    harshness = 1.7
}) {
    /**
     * Neurovisceral Interface Mapping (V2.1)
     * 
     * Translates Apple Watch biometric streams into regional brain stress indices
     * using a nonlinear power-law escalation model.
     * 
     * Output Scale: 0.0 (Homeostasis) to 1.0 (Acute Autonomic Disruption)
     */

    // ---- Physiological Baselines (Typical Resting Values) ----
    const BASE_RMSSD = 50;      // ms
    const BASE_RESP = 14;       // breaths/min
    const BASE_SPO2 = 98;       // %
    const BASE_HR = 65;         // bpm

    // ---- Normalize Deviations (0.0 = Normal/Healthy) ----
    // RMSSD: Higher is better; we measure the drop toward 15ms
    const rmssd_dev = Math.max(0.0, (BASE_RMSSD - rmssd) / 35.0);

    // Resp Rate: Measuring elevation above resting 14bpm
    const resp_dev = Math.max(0.0, (resp_rate - BASE_RESP) / 10.0);

    // SpO2: Measuring drop below 98%
    const spo2_dev = Math.max(0.0, (BASE_SPO2 - spo2) / 6.0);

    // HR: Measuring elevation above 65bpm
    const hr_dev = Math.max(0.0, (heart_rate - BASE_HR) / 35.0);


    // ---- Raw Autonomic Stress (Weighted Sum) ----
    // Heavily weighted toward RMSSD (Vagal Tone) and Respiratory Rate
    const s_raw = sensitivity * (
        (0.45 * rmssd_dev) +
        (0.25 * resp_dev) +
        (0.15 * spo2_dev) +
        (0.15 * hr_dev)
    );


    // ---- Nonlinear Escalation (The "Harshness" Factor) ----
    // This simulates the 'tipping point' of the nervous system
    const s = Math.max(0.0, Math.min(1.0, Math.pow(s_raw, harshness)));


    // ---- Regional Brain Stress Mapping ----
    // We apply specific exponents to simulate how different brain
    // regions respond to the global stress signal.

    // Temporal (Amygdala/Limbic): Fast activation
    const temporal = Math.min(1.0, Math.pow(s, 1.2));

    // Frontal (Prefrontal Cortex): Represents regulatory failure (dimming)
    const frontal = Math.min(1.0, Math.pow(s, 1.8));

    // Cerebellum (Autonomic tuning): Moderate/Physical response
    const cerebellum = Math.min(1.0, 0.6 * Math.pow(s, 1.3));

    // Parietal (Salience / Attention networks): High environmental alertness
    const parietal = Math.min(1.0, 0.8 * Math.pow(s, 1.4));

    // Occipital (Visual): Low sensitivity to autonomic stress
    const occipital = Math.min(1.0, 0.3 * Math.pow(s, 1.2));


    return {
        Temporal: Number(temporal.toFixed(3)),
        Frontal: Number(frontal.toFixed(3)),
        Cerebellum: Number(cerebellum.toFixed(3)),
        Parietal: Number(parietal.toFixed(3)),
        Occipital: Number(occipital.toFixed(3)),
        Global_S: Number(s.toFixed(3))
    };
}

// --- Example Usage (Simulating Acute Stress/Apnea Event) ---
const stats = {
    rmssd: 18,
    sdnn: 35,
    resp_rate: 24,
    spo2: 92,
    heart_rate: 95
};


const college_stress = {
    rmssd: 15,
    sdnn: 25,
    resp_rate: 28,
    spo2: 95,
    heart_rate: 115
};

const high_respiratory = {
    rmssd: 10,
    sdnn: 18,
    resp_rate: 42,
    spo2: 94,
    heart_rate: 165
};

const normal = {
    rmssd: 50,
    sdnn: 65,
    resp_rate: 14,
    spo2: 98,
    heart_rate: 65
};

let brain_values = calculate_neuro_interface_values(college_stress);

brain_values = Object.fromEntries(
    Object.entries(brain_values).map(([k, v]) => [k, Number(Math.pow(v, 2).toFixed(3))])
);

console.log("Neurovisceral Output:", brain_values);

// Export for usage elsewhere if needed
module.exports = { calculate_neuro_interface_values };
