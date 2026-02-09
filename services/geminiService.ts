
import { GoogleGenAI, Type } from "@google/genai";
import { Patient, Session, AIInsight, Assessment, PrescriptionItem } from "../types";

export interface ScanResult {
  rawText: string;
  prescriptionDate: string;
  hospitalName: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  items: PrescriptionItem[];
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async scanPrescription(base64Image: string): Promise<ScanResult> {
    const prompt = `
      Act as a high-precision Medical Transcription Engine. 
      Analyze the attached handwritten prescription image.
      
      STEP 1: Perform exact OCR to extract all readable text.
      STEP 2: Structure the metadata and medications found into a clinical schema.
      
      Required Metadata:
      - Prescription Date: The date written on the slip (YYYY-MM-DD format if possible).
      - Hospital/Clinic Name: Include the City name if it is visible on the prescription (e.g., "A.I.M.S. Hospital, New Delhi").
      - Prescribing Doctor Name.
      - Department (e.g., Cardiology, Psychiatry, General Medicine).
      - Diagnosis or Provisional Diagnosis written on the slip.

      Required Medication Details:
      - For each medication, extract: Name, Dosage (e.g., 20mg), Frequency (e.g., OD, BD, qHS), and Duration.
      - Assign a confidence score (high, medium, low) to each extraction based on legibility.
      - If dosage or frequency is unreadable, leave as empty string but flag as 'low' confidence.
      
      DO NOT invent data. If a field is not found, return an empty string.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rawText: { type: Type.STRING, description: "Full raw OCR output" },
              prescriptionDate: { type: Type.STRING },
              hospitalName: { type: Type.STRING },
              doctorName: { type: Type.STRING },
              department: { type: Type.STRING },
              diagnosis: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: ["high", "medium", "low"] }
                  },
                  required: ["name", "dosage", "frequency", "duration", "confidence"]
                }
              }
            },
            required: ["rawText", "prescriptionDate", "hospitalName", "doctorName", "department", "diagnosis", "items"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Prescription Scan Error:", error);
      throw error;
    }
  }

  async analyzePatientHistory(patient: Patient, sessions: Session[]): Promise<AIInsight> {
    const prompt = `
      Analyze the following longitudinal clinical data for patient ${patient.name}.
      
      Patient Info:
      Diagnosis: ${patient.diagnosis || 'None'}
      
      Medical History:
      ${patient.medicalHistory?.map(m => `
        - Illness: ${m.name} (Started: ${m.startDate})
        - Medications: ${m.medications.map(med => `${med.name} (${med.dosage})`).join(', ')}
      `).join('\n') || 'None'}

      Session History:
      ${sessions.map(s => `
        Date: ${s.date}
        Symptoms: ${s.symptoms.join(', ')}
        Notes: ${s.notes}
        Scores: PHQ-9: ${s.assessments.find(a => a.type === 'PHQ-9')?.score || 'N/A'}
      `).join('\n')}

      IMPORTANT: 
      - Do NOT provide a medical diagnosis.
      - Correlate psychological trends with chronic medical conditions.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              trendAnalysis: { type: Type.STRING },
              clinicalFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
              confidence: { type: Type.NUMBER }
            },
            required: ["summary", "trendAnalysis", "clinicalFlags", "keyChanges", "confidence"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }

  async interpretTestResult(assessment: Assessment, previousAssessment?: Assessment): Promise<string> {
    const prompt = `
      Interpret clinical test results.
      Test: ${assessment.type}, Score: ${assessment.score}, Severity: ${assessment.severity}.
      ${previousAssessment ? `Prev Score: ${previousAssessment.score}.` : ''}
      Provide statistical comparison and item-level highlights. No diagnosis.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      return response.text?.trim() || "Interpretation unavailable.";
    } catch (error) {
      console.error("Gemini Interpretation Error:", error);
      return "Error generating interpretation.";
    }
  }
}
