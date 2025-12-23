
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistantResponse = async (userPrompt: string, products: any[]) => {
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    Bạn là một chuyên gia tư vấn Flycam và Action Cam tại hệ thống KIÊN DRONE.
    Dưới đây là danh sách sản phẩm hiện có: ${JSON.stringify(products)}.
    Hãy trả lời khách hàng một cách thân thiện, chuyên nghiệp, thể hiện sự am hiểu kỹ thuật sâu sắc bằng tiếng Việt.
    Nếu khách hỏi về lựa chọn sản phẩm, hãy gợi ý dựa trên nhu cầu (quay phim chuyên nghiệp, du lịch, hay ngân sách).
    Luôn nhấn mạnh về chính sách bảo hành 12 tháng và hỗ trợ kỹ thuật trọn đời tại KIÊN DRONE.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Xin lỗi, KIÊN DRONE đang gặp chút trục trặc kỹ thuật. Bạn vui lòng liên hệ hotline 0394300132 để được hỗ trợ ngay lập tức!";
  }
};
