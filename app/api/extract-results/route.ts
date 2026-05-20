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
Extract exam results from this Ghanaian ${level} certificate image.

Return subjects and grades exactly as visible.

Rules:
- Use uppercase subject names.
- Use exact grades: A1, B2, B3, C4, C5, C6, D7, E8, F9, or numeric grades if shown.
- Omit subjects with no visible grade.
- Do not invent missing subjects.
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
          name: "exam_results",
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
            },
            required: ["level", "results"],
          },
        },
      },
    });

    const text = response.output_text;
    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Extraction failed" },
      { status: 500 }
    );
  }
}
