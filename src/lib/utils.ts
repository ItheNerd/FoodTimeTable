import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: String) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function fetchData() {
  try {
    const response = await fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=yEp2q6iX3UDEnzkeNu17UzJnU_PyfV0bViEbPXiFEMKnLIUjlx-SBjGuiBJL1gNQteRQhhMoNdh5ZzFQNkLoi8U3dT7QiVyRm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnA-2R3F4XySc32DTDFnkNP9tB_Y731q2NTx8F_7ojeZmZFQj0RJ_qP66_d9TMo-7JDY7XEcgDXg80N8XUDKANdBOscqqJNSY6A&lib=MOOtrVFhet1ixZGvJDbFzCgcBX2ll90v-"
    ); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
