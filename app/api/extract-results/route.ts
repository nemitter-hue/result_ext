import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const level = formData.get("level") as "JHS" | "SHS" | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!level) {
      return NextResponse.json({ error: "Level is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Extract exam results and degree information from this Ghanaian ${level} certificate image.

Return subjects and grades exactly as visible.

Exam result rules:
- Use uppercase subject names.
- Use exact grades: A1, B2, B3, C4, C5, C6, D7, E8, F9, or numeric grades if shown.
- Omit subjects with no visible grade.
- Do not invent missing subjects.

Degree extraction rules:
- Extract degree information only if visible.
- Discipline means the programme, course, or field of study.
- GPA means grade point average.
- Class means degree classification.
- Do not invent degree information if it is not visible.

Allowed Class values:
- First Class Honours
- Second Class Honours – Upper Division
- Second Class Honours – Lower Division
- Third Class Honours

If degree information is not visible, return an empty degrees array.
              `.trim(),
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${base64Image}`,
              detail: "auto",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "exam_and_degree_results",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              level: {
                type: "string",
                enum: ["JHS", "SHS"],
              },
              results: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    subject: { type: "string" },
                    grade: { type: "string" },
                  },
                  required: ["subject", "grade"],
                },
              },
              degrees: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    discipline: { type: "string" },
                    gpa: { type: "string" },
                    class: {
                      type: "string",
                      enum: [
                        "First Class Honours",
                        "Second Class Honours – Upper Division",
                        "Second Class Honours – Lower Division",
                        "Third Class Honours",
                        "",
                      ],
                    },
                  },
                  required: ["discipline", "gpa", "class"],
                },
              },
            },
            required: ["level", "results", "degrees"],
          },
        },
      },
    });

    const parsed = JSON.parse(response.output_text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Extraction failed" },
      { status: 500 }
    );
  }
}
