import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const vapi = new Vapi(publicKey);

export { vapi, vapiAssistantId };