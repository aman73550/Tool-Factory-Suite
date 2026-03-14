import imageCompression from 'browser-image-compression';

export type ToolField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'file' | 'select';
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: any;
};

export type ToolConfig = {
  fields: ToolField[];
  handler: (data: Record<string, any>) => Promise<{ result?: any; error?: string; type?: 'text' | 'json' | 'image' | 'qrcode' }>;
};

export const toolEngine: Record<string, ToolConfig> = {
  generatePassword: {
    fields: [
      { name: 'length', label: 'Password Length', type: 'number', defaultValue: 16 },
      { name: 'uppercase', label: 'Include Uppercase', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' },
      { name: 'numbers', label: 'Include Numbers', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' },
      { name: 'symbols', label: 'Include Symbols', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' }
    ],
    handler: async (data) => {
      const length = parseInt(data.length) || 16;
      const upper = data.uppercase === 'true';
      const nums = data.numbers === 'true';
      const syms = data.symbols === 'true';
      
      let chars = 'abcdefghijklmnopqrstuvwxyz';
      if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (nums) chars += '0123456789';
      if (syms) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
      
      let pass = '';
      for (let i = 0; i < length; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
      return { result: pass, type: 'text' };
    }
  },
  
  formatJSON: {
    fields: [
      { name: 'input', label: 'JSON String', type: 'textarea', placeholder: '{"key": "value"}' }
    ],
    handler: async (data) => {
      try {
        const parsed = JSON.parse(data.input);
        return { result: JSON.stringify(parsed, null, 2), type: 'json' };
      } catch (e: any) {
        return { error: `Invalid JSON: ${e.message}` };
      }
    }
  },

  generateQRCode: {
    fields: [
      { name: 'text', label: 'Text or URL', type: 'text', placeholder: 'https://example.com' }
    ],
    handler: async (data) => {
      if (!data.text) return { error: 'Please enter text to encode' };
      return { result: data.text, type: 'qrcode' };
    }
  },

  calculateGST: {
    fields: [
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '100' },
      { name: 'rate', label: 'GST Rate (%)', type: 'number', defaultValue: 10 }
    ],
    handler: async (data) => {
      const amount = parseFloat(data.amount);
      const rate = parseFloat(data.rate);
      if (isNaN(amount) || isNaN(rate)) return { error: 'Invalid numbers' };
      
      const gst = (amount * rate) / 100;
      const total = amount + gst;
      return { 
        result: `Original Amount: $${amount.toFixed(2)}\nGST (${rate}%): $${gst.toFixed(2)}\nTotal Amount: $${total.toFixed(2)}`,
        type: 'text'
      };
    }
  },

  countWords: {
    fields: [
      { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter your text here...' }
    ],
    handler: async (data) => {
      const text = data.text || '';
      const words = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      return {
        result: `Words: ${words}\nCharacters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpaces}`,
        type: 'text'
      };
    }
  },

  encodeBase64: {
    fields: [
      { name: 'action', label: 'Action', type: 'select', options: [{label:'Encode', value:'encode'}, {label:'Decode', value:'decode'}], defaultValue: 'encode' },
      { name: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter string...' }
    ],
    handler: async (data) => {
      try {
        if (!data.text) return { error: 'Enter text to process' };
        if (data.action === 'encode') {
          return { result: btoa(data.text), type: 'text' };
        } else {
          return { result: atob(data.text), type: 'text' };
        }
      } catch (e) {
        return { error: 'Invalid Base64 string' };
      }
    }
  },

  compressImage: {
    fields: [
      { name: 'image', label: 'Upload Image', type: 'file' }
    ],
    handler: async (data) => {
      try {
        const file = data.image as File;
        if (!file) return { error: 'Please upload an image' };
        
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        const url = URL.createObjectURL(compressedFile);
        
        return { 
          result: url, 
          type: 'image'
        };
      } catch (e: any) {
        return { error: `Compression failed: ${e.message}` };
      }
    }
  }
};
