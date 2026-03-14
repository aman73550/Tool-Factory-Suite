import imageCompression from 'browser-image-compression';

export type ToolField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'file' | 'select' | 'color' | 'range';
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
};

export type ToolResult = {
  result?: any;
  error?: string;
  type?: 'text' | 'json' | 'image' | 'qrcode' | 'gradient' | 'color' | 'html';
};

export type ToolConfig = {
  fields: ToolField[];
  handler: (data: Record<string, any>) => Promise<ToolResult>;
};

function md5(input: string): string {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function calculateMD5(s: number[]): number[] {
    const n = s.length;
    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < n; i += 16) {
      const olda = a, oldb = b, oldc = c, oldd = d;
      a = md5ff(a, b, c, d, s[i], 7, -680876936); d = md5ff(d, a, b, c, s[i+1], 12, -389564586); c = md5ff(c, d, a, b, s[i+2], 17, 606105819); b = md5ff(b, c, d, a, s[i+3], 22, -1044525330);
      a = md5ff(a, b, c, d, s[i+4], 7, -176418897); d = md5ff(d, a, b, c, s[i+5], 12, 1200080426); c = md5ff(c, d, a, b, s[i+6], 17, -1473231341); b = md5ff(b, c, d, a, s[i+7], 22, -45705983);
      a = md5ff(a, b, c, d, s[i+8], 7, 1770035416); d = md5ff(d, a, b, c, s[i+9], 12, -1958414417); c = md5ff(c, d, a, b, s[i+10], 17, -42063); b = md5ff(b, c, d, a, s[i+11], 22, -1990404162);
      a = md5ff(a, b, c, d, s[i+12], 7, 1804603682); d = md5ff(d, a, b, c, s[i+13], 12, -40341101); c = md5ff(c, d, a, b, s[i+14], 17, -1502002290); b = md5ff(b, c, d, a, s[i+15], 22, 1236535329);
      a = md5gg(a, b, c, d, s[i+1], 5, -165796510); d = md5gg(d, a, b, c, s[i+6], 9, -1069501632); c = md5gg(c, d, a, b, s[i+11], 14, 643717713); b = md5gg(b, c, d, a, s[i], 20, -373897302);
      a = md5gg(a, b, c, d, s[i+5], 5, -701558691); d = md5gg(d, a, b, c, s[i+10], 9, 38016083); c = md5gg(c, d, a, b, s[i+15], 14, -660478335); b = md5gg(b, c, d, a, s[i+4], 20, -405537848);
      a = md5gg(a, b, c, d, s[i+9], 5, 568446438); d = md5gg(d, a, b, c, s[i+14], 9, -1019803690); c = md5gg(c, d, a, b, s[i+3], 14, -187363961); b = md5gg(b, c, d, a, s[i+8], 20, 1163531501);
      a = md5gg(a, b, c, d, s[i+13], 5, -1444681467); d = md5gg(d, a, b, c, s[i+2], 9, -51403784); c = md5gg(c, d, a, b, s[i+7], 14, 1735328473); b = md5gg(b, c, d, a, s[i+12], 20, -1926607734);
      a = md5hh(a, b, c, d, s[i+5], 4, -378558); d = md5hh(d, a, b, c, s[i+8], 11, -2022574463); c = md5hh(c, d, a, b, s[i+11], 16, 1839030562); b = md5hh(b, c, d, a, s[i+14], 23, -35309556);
      a = md5hh(a, b, c, d, s[i+1], 4, -1530992060); d = md5hh(d, a, b, c, s[i+4], 11, 1272893353); c = md5hh(c, d, a, b, s[i+7], 16, -155497632); b = md5hh(b, c, d, a, s[i+10], 23, -1094730640);
      a = md5hh(a, b, c, d, s[i+13], 4, 681279174); d = md5hh(d, a, b, c, s[i], 11, -358537222); c = md5hh(c, d, a, b, s[i+3], 16, -722521979); b = md5hh(b, c, d, a, s[i+6], 23, 76029189);
      a = md5hh(a, b, c, d, s[i+9], 4, -640364487); d = md5hh(d, a, b, c, s[i+12], 11, -421815835); c = md5hh(c, d, a, b, s[i+15], 16, 530742520); b = md5hh(b, c, d, a, s[i+2], 23, -995338651);
      a = md5ii(a, b, c, d, s[i], 6, -198630844); d = md5ii(d, a, b, c, s[i+7], 10, 1126891415); c = md5ii(c, d, a, b, s[i+14], 15, -1416354905); b = md5ii(b, c, d, a, s[i+5], 21, -57434055);
      a = md5ii(a, b, c, d, s[i+12], 6, 1700485571); d = md5ii(d, a, b, c, s[i+3], 10, -1894986606); c = md5ii(c, d, a, b, s[i+10], 15, -1051523); b = md5ii(b, c, d, a, s[i+1], 21, -2054922799);
      a = md5ii(a, b, c, d, s[i+8], 6, 1873313359); d = md5ii(d, a, b, c, s[i+15], 10, -30611744); c = md5ii(c, d, a, b, s[i+6], 15, -1560198380); b = md5ii(b, c, d, a, s[i+13], 21, 1309151649);
      a = md5ii(a, b, c, d, s[i+4], 6, -145523070); d = md5ii(d, a, b, c, s[i+11], 10, -1120210379); c = md5ii(c, d, a, b, s[i+2], 15, 718787259); b = md5ii(b, c, d, a, s[i+9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function str2binl(str: string) {
    const bin: number[] = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
    }
    return bin;
  }
  function binl2hex(binarray: number[]) {
    const hex = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str += hex.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) + hex.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
    }
    return str;
  }
  function hexMD5(str: string) {
    return binl2hex(calculateMD5(str2binl(str).concat([]), str.length * 8));
  }
  return hexMD5(input);
}

const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

export const toolEngine: Record<string, ToolConfig> = {
  generatePassword: {
    fields: [
      { name: 'length', label: 'Password Length', type: 'number', defaultValue: 16, min: 4, max: 128 },
      { name: 'uppercase', label: 'Include Uppercase', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' },
      { name: 'numbers', label: 'Include Numbers', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' },
      { name: 'symbols', label: 'Include Symbols', type: 'select', options: [{label:'Yes', value:'true'}, {label:'No', value:'false'}], defaultValue: 'true' },
    ],
    handler: async (data) => {
      const length = Math.min(128, Math.max(4, parseInt(data.length) || 16));
      let chars = 'abcdefghijklmnopqrstuvwxyz';
      if (data.uppercase === 'true') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (data.numbers === 'true') chars += '0123456789';
      if (data.symbols === 'true') chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      let pass = '';
      for (let i = 0; i < length; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
      return { result: pass, type: 'text' };
    },
  },

  formatJSON: {
    fields: [
      { name: 'input', label: 'JSON Input', type: 'textarea', placeholder: '{"key": "value"}' },
      { name: 'indent', label: 'Indentation', type: 'select', options: [{label:'2 Spaces', value:'2'}, {label:'4 Spaces', value:'4'}, {label:'Tab', value:'tab'}], defaultValue: '2' },
    ],
    handler: async (data) => {
      try {
        if (!data.input?.trim()) return { error: 'Please enter JSON to format' };
        const parsed = JSON.parse(data.input);
        const indent = data.indent === 'tab' ? '\t' : parseInt(data.indent) || 2;
        return { result: JSON.stringify(parsed, null, indent), type: 'json' };
      } catch (e: any) {
        return { error: `Invalid JSON: ${e.message}` };
      }
    },
  },

  generateQRCode: {
    fields: [
      { name: 'text', label: 'Text or URL', type: 'text', placeholder: 'https://example.com' },
      { name: 'size', label: 'Size', type: 'select', options: [{label:'Small (128px)', value:'128'}, {label:'Medium (256px)', value:'256'}, {label:'Large (512px)', value:'512'}], defaultValue: '256' },
    ],
    handler: async (data) => {
      if (!data.text?.trim()) return { error: 'Please enter text to encode into a QR code' };
      return { result: data.text, type: 'qrcode' };
    },
  },

  calculateGST: {
    fields: [
      { name: 'amount', label: 'Amount ($)', type: 'number', placeholder: '1000' },
      { name: 'rate', label: 'GST Rate (%)', type: 'number', defaultValue: 10 },
      { name: 'type', label: 'Calculation Type', type: 'select', options: [{label:'Add GST to amount', value:'add'}, {label:'Extract GST from total', value:'extract'}], defaultValue: 'add' },
    ],
    handler: async (data) => {
      const amount = parseFloat(data.amount);
      const rate = parseFloat(data.rate);
      if (isNaN(amount) || isNaN(rate)) return { error: 'Please enter valid numbers' };
      if (rate < 0 || rate > 100) return { error: 'GST rate must be between 0 and 100' };
      if (data.type === 'extract') {
        const gst = amount - (amount * 100 / (100 + rate));
        const base = amount - gst;
        return { result: `Base Amount (excl. GST): $${base.toFixed(2)}\nGST Amount (${rate}%): $${gst.toFixed(2)}\nTotal Amount (incl. GST): $${amount.toFixed(2)}`, type: 'text' };
      } else {
        const gst = (amount * rate) / 100;
        const total = amount + gst;
        return { result: `Original Amount: $${amount.toFixed(2)}\nGST Amount (${rate}%): $${gst.toFixed(2)}\nTotal (incl. GST): $${total.toFixed(2)}`, type: 'text' };
      }
    },
  },

  calculateAge: {
    fields: [
      { name: 'birthdate', label: 'Date of Birth', type: 'text', placeholder: 'YYYY-MM-DD (e.g. 1990-05-15)' },
    ],
    handler: async (data) => {
      if (!data.birthdate) return { error: 'Please enter a birth date' };
      const birth = new Date(data.birthdate);
      if (isNaN(birth.getTime())) return { error: 'Invalid date format. Use YYYY-MM-DD' };
      const now = new Date();
      if (birth > now) return { error: 'Birth date cannot be in the future' };
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
      return {
        result: `Age: ${years} years, ${months} months, ${days} days\nTotal Days Lived: ${totalDays.toLocaleString()}\nNext Birthday: ${months === 0 && days === 0 ? 'Today! 🎉' : `In ${12 - (now.getMonth() - birth.getMonth() + 12) % 12} months`}`,
        type: 'text',
      };
    },
  },

  countWords: {
    fields: [
      { name: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste or type your text here...' },
    ],
    handler: async (data) => {
      const text: string = data.text || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
      const readingTime = Math.ceil(words / 225);
      return {
        result: `Words: ${words}\nCharacters (with spaces): ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nEstimated reading time: ~${readingTime} min`,
        type: 'text',
      };
    },
  },

  encodeBase64: {
    fields: [
      { name: 'action', label: 'Action', type: 'select', options: [{label:'Encode to Base64', value:'encode'}, {label:'Decode from Base64', value:'decode'}], defaultValue: 'encode' },
      { name: 'text', label: 'Input Text', type: 'textarea', placeholder: 'Enter text...' },
    ],
    handler: async (data) => {
      if (!data.text?.trim()) return { error: 'Please enter text to process' };
      try {
        if (data.action === 'encode') {
          return { result: btoa(unescape(encodeURIComponent(data.text))), type: 'text' };
        } else {
          return { result: decodeURIComponent(escape(atob(data.text))), type: 'text' };
        }
      } catch {
        return { error: 'Invalid Base64 string. Make sure it is properly encoded.' };
      }
    },
  },

  encodeURL: {
    fields: [
      { name: 'action', label: 'Action', type: 'select', options: [{label:'Encode URL', value:'encode'}, {label:'Decode URL', value:'decode'}], defaultValue: 'encode' },
      { name: 'text', label: 'Input', type: 'textarea', placeholder: 'Enter URL or encoded string...' },
    ],
    handler: async (data) => {
      if (!data.text?.trim()) return { error: 'Please enter text to process' };
      try {
        if (data.action === 'encode') {
          return { result: encodeURIComponent(data.text), type: 'text' };
        } else {
          return { result: decodeURIComponent(data.text), type: 'text' };
        }
      } catch {
        return { error: 'Invalid URL-encoded string' };
      }
    },
  },

  convertUnit: {
    fields: [
      { name: 'type', label: 'Unit Type', type: 'select', options: [
        {label:'Length', value:'length'},
        {label:'Weight / Mass', value:'weight'},
        {label:'Temperature', value:'temperature'},
        {label:'Volume', value:'volume'},
        {label:'Speed', value:'speed'},
        {label:'Area', value:'area'},
        {label:'Time', value:'time'},
      ], defaultValue: 'length' },
      { name: 'value', label: 'Value', type: 'number', placeholder: '1' },
      { name: 'from', label: 'From Unit', type: 'text', placeholder: 'km' },
      { name: 'to', label: 'To Unit', type: 'text', placeholder: 'miles' },
    ],
    handler: async (data) => {
      const value = parseFloat(data.value);
      if (isNaN(value)) return { error: 'Please enter a valid number' };
      const from = data.from?.toLowerCase().trim();
      const to = data.to?.toLowerCase().trim();

      const conversions: Record<string, Record<string, number>> = {
        length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, miles: 1609.344, mi: 1609.344, ft: 0.3048, feet: 0.3048, in: 0.0254, inch: 0.0254, inches: 0.0254, yard: 0.9144, yards: 0.9144, yd: 0.9144, nm: 1852 },
        weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, lbs: 0.453592, oz: 0.0283495, ton: 1000, tonne: 1000, stone: 6.35029, st: 6.35029 },
        volume: { l: 1, ml: 0.001, gal: 3.78541, gallon: 3.78541, qt: 0.946353, quart: 0.946353, pt: 0.473176, pint: 0.473176, cup: 0.236588, tbsp: 0.0147868, tsp: 0.00492892, m3: 1000, cm3: 0.001, ft3: 28.3168 },
        speed: { 'km/h': 1, 'kph': 1, 'm/s': 3.6, 'mph': 1.60934, 'knots': 1.852, 'knot': 1.852 },
        area: { m2: 1, km2: 1000000, cm2: 0.0001, ft2: 0.092903, acre: 4046.86, acres: 4046.86, ha: 10000, hectare: 10000 },
        time: { s: 1, sec: 1, min: 60, h: 3600, hr: 3600, hour: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600 },
      };

      const type = data.type || 'length';

      if (type === 'temperature') {
        let celsius: number;
        if (['c', '°c', 'celsius'].includes(from)) celsius = value;
        else if (['f', '°f', 'fahrenheit'].includes(from)) celsius = (value - 32) * 5 / 9;
        else if (['k', 'kelvin'].includes(from)) celsius = value - 273.15;
        else return { error: `Unknown unit: ${from}. Try C, F, or K` };

        let result: number;
        let unit: string;
        if (['c', '°c', 'celsius'].includes(to)) { result = celsius; unit = '°C'; }
        else if (['f', '°f', 'fahrenheit'].includes(to)) { result = celsius * 9 / 5 + 32; unit = '°F'; }
        else if (['k', 'kelvin'].includes(to)) { result = celsius + 273.15; unit = 'K'; }
        else return { error: `Unknown unit: ${to}. Try C, F, or K` };

        return { result: `${value} ${from.toUpperCase()} = ${result.toFixed(4)} ${unit}`, type: 'text' };
      }

      const units = conversions[type];
      if (!units) return { error: `Unknown type: ${type}` };
      if (!(from in units)) return { error: `Unknown unit: "${from}". Available: ${Object.keys(units).join(', ')}` };
      if (!(to in units)) return { error: `Unknown unit: "${to}". Available: ${Object.keys(units).join(', ')}` };

      const inBase = value * units[from];
      const result = inBase / units[to];
      return { result: `${value} ${from} = ${result.toFixed(6).replace(/\.?0+$/, '')} ${to}`, type: 'text' };
    },
  },

  calculateProfit: {
    fields: [
      { name: 'cost', label: 'Cost Price ($)', type: 'number', placeholder: '100' },
      { name: 'revenue', label: 'Selling Price ($)', type: 'number', placeholder: '150' },
    ],
    handler: async (data) => {
      const cost = parseFloat(data.cost);
      const revenue = parseFloat(data.revenue);
      if (isNaN(cost) || isNaN(revenue)) return { error: 'Please enter valid numbers' };
      if (cost <= 0) return { error: 'Cost price must be greater than 0' };
      const profit = revenue - cost;
      const margin = (profit / revenue) * 100;
      const markup = (profit / cost) * 100;
      const roi = (profit / cost) * 100;
      return {
        result: `Profit / Loss: $${profit.toFixed(2)} ${profit >= 0 ? '✅' : '❌'}\nProfit Margin: ${margin.toFixed(2)}%\nMarkup Percentage: ${markup.toFixed(2)}%\nReturn on Investment (ROI): ${roi.toFixed(2)}%`,
        type: 'text',
      };
    },
  },

  calculateDiscount: {
    fields: [
      { name: 'price', label: 'Original Price ($)', type: 'number', placeholder: '200' },
      { name: 'discount', label: 'Discount (%)', type: 'number', placeholder: '20' },
      { name: 'tax', label: 'Tax Rate (%) — optional', type: 'number', defaultValue: 0 },
    ],
    handler: async (data) => {
      const price = parseFloat(data.price);
      const discount = parseFloat(data.discount);
      const tax = parseFloat(data.tax) || 0;
      if (isNaN(price) || isNaN(discount)) return { error: 'Please enter valid numbers' };
      if (discount < 0 || discount > 100) return { error: 'Discount must be between 0 and 100%' };
      const savings = price * (discount / 100);
      const afterDiscount = price - savings;
      const taxAmount = afterDiscount * (tax / 100);
      const finalPrice = afterDiscount + taxAmount;
      return {
        result: `Original Price: $${price.toFixed(2)}\nDiscount (${discount}%): -$${savings.toFixed(2)}\nPrice after Discount: $${afterDiscount.toFixed(2)}${tax > 0 ? `\nTax (${tax}%): +$${taxAmount.toFixed(2)}\nFinal Price: $${finalPrice.toFixed(2)}` : ''}`,
        type: 'text',
      };
    },
  },

  generateGradient: {
    fields: [
      { name: 'type', label: 'Gradient Type', type: 'select', options: [{label:'Linear', value:'linear'}, {label:'Radial', value:'radial'}, {label:'Conic', value:'conic'}], defaultValue: 'linear' },
      { name: 'color1', label: 'Start Color', type: 'color', defaultValue: '#6366f1' },
      { name: 'color2', label: 'End Color', type: 'color', defaultValue: '#8b5cf6' },
      { name: 'angle', label: 'Angle (degrees) — for linear', type: 'number', defaultValue: 135 },
    ],
    handler: async (data) => {
      const { type, color1, color2, angle } = data;
      let css = '';
      if (type === 'linear') css = `linear-gradient(${angle || 135}deg, ${color1}, ${color2})`;
      else if (type === 'radial') css = `radial-gradient(circle, ${color1}, ${color2})`;
      else css = `conic-gradient(from 0deg, ${color1}, ${color2}, ${color1})`;
      const code = `background: ${css};`;
      return { result: JSON.stringify({ css, code, color1, color2, type }), type: 'gradient' };
    },
  },

  pickColor: {
    fields: [
      { name: 'color', label: 'Pick a Color', type: 'color', defaultValue: '#6366f1' },
    ],
    handler: async (data) => {
      const hex = data.color || '#000000';
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const hslR = r / 255, hslG = g / 255, hslB = b / 255;
      const max = Math.max(hslR, hslG, hslB), min = Math.min(hslR, hslG, hslB);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === hslR) h = (hslG - hslB) / d + (hslG < hslB ? 6 : 0);
        else if (max === hslG) h = (hslB - hslR) / d + 2;
        else h = (hslR - hslG) / d + 4;
        h /= 6;
      }
      return {
        result: `HEX: ${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nRGBA: rgba(${r}, ${g}, ${b}, 1)\nHSL: hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)\nCSS variable: --color: ${hex};`,
        type: 'color',
      };
    },
  },

  compressImage: {
    fields: [
      { name: 'image', label: 'Upload Image (JPEG/PNG/WebP)', type: 'file' },
      { name: 'quality', label: 'Quality', type: 'select', options: [{label:'High (80%)', value:'0.8'}, {label:'Medium (60%)', value:'0.6'}, {label:'Low (40%)', value:'0.4'}], defaultValue: '0.8' },
    ],
    handler: async (data) => {
      const file = data.image as File;
      if (!file) return { error: 'Please upload an image file' };
      if (!file.type.startsWith('image/')) return { error: 'Please upload a valid image file (JPEG, PNG, WebP)' };
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, initialQuality: parseFloat(data.quality) || 0.8 };
        const compressed = await imageCompression(file, options);
        const url = URL.createObjectURL(compressed);
        const originalKB = Math.round(file.size / 1024);
        const compressedKB = Math.round(compressed.size / 1024);
        const saved = Math.round((1 - compressed.size / file.size) * 100);
        return { result: JSON.stringify({ url, originalKB, compressedKB, saved }), type: 'image' };
      } catch (e: any) {
        return { error: `Compression failed: ${e.message}` };
      }
    },
  },

  generateYouTubeTitle: {
    fields: [
      { name: 'topic', label: 'Video Topic', type: 'text', placeholder: 'How to make money online' },
      { name: 'style', label: 'Title Style', type: 'select', options: [
        {label:'How-To', value:'howto'},
        {label:'Listicle', value:'list'},
        {label:'Clickbait / Curiosity', value:'clickbait'},
        {label:'Tutorial', value:'tutorial'},
        {label:'Review', value:'review'},
      ], defaultValue: 'howto' },
    ],
    handler: async (data) => {
      if (!data.topic?.trim()) return { error: 'Please enter a video topic' };
      const topic = data.topic.trim();
      const templates: Record<string, string[]> = {
        howto: [
          `How to ${topic} (Step-by-Step Guide for Beginners)`,
          `How I ${topic} — And You Can Too`,
          `The EASIEST Way to ${topic} in 2025`,
          `How to ${topic} Fast (Without Experience)`,
          `Learn How to ${topic} in Under 10 Minutes`,
        ],
        list: [
          `10 Best Ways to ${topic} That Actually Work`,
          `7 Things I Wish I Knew Before ${topic}`,
          `5 Mistakes People Make When ${topic}`,
          `Top 10 Tips for ${topic} in 2025`,
          `3 PROVEN Strategies for ${topic}`,
        ],
        clickbait: [
          `I Tried ${topic} for 30 Days... Here's What Happened`,
          `Nobody Tells You THIS About ${topic}`,
          `The TRUTH About ${topic} (Watch Before It's Deleted)`,
          `This ${topic} Trick Changed Everything`,
          `Warning: Watch This Before You ${topic}`,
        ],
        tutorial: [
          `${topic} — Complete Beginner Tutorial 2025`,
          `Ultimate Guide to ${topic} (Full Tutorial)`,
          `${topic} Crash Course for Beginners`,
          `Master ${topic} in One Video`,
          `${topic} Tutorial — From Zero to Pro`,
        ],
        review: [
          `Is ${topic} Worth It in 2025? Honest Review`,
          `I Tested ${topic} For 30 Days — My Honest Review`,
          `${topic} Review — Everything You Need to Know`,
          `${topic} — The Good, The Bad, and The Ugly`,
          `Before You Try ${topic}, Watch This`,
        ],
      };
      const titles = templates[data.style] || templates.howto;
      return { result: titles.join('\n\n'), type: 'text' };
    },
  },

  generateHashtags: {
    fields: [
      { name: 'topic', label: 'Post Topic or Keywords', type: 'text', placeholder: 'travel photography sunset' },
      { name: 'count', label: 'Number of Hashtags', type: 'select', options: [{label:'5 tags', value:'5'}, {label:'10 tags', value:'10'}, {label:'20 tags', value:'20'}, {label:'30 tags (max)', value:'30'}], defaultValue: '30' },
    ],
    handler: async (data) => {
      if (!data.topic?.trim()) return { error: 'Please enter a topic' };
      const words = data.topic.trim().toLowerCase().split(/\s+/);
      const count = parseInt(data.count) || 30;

      const baseHashtags = words.map(w => `#${w.replace(/[^a-z0-9]/g, '')}`).filter(h => h.length > 1);
      const combined = words.length > 1 ? [`#${words.join('')}`, `#${words.join('_')}`] : [];
      const modifiers = ['tips', 'daily', 'love', 'life', 'inspo', 'vibes', 'goals', 'motivation', 'style', 'photo', 'art', 'design', 'business', 'success', 'mindset', 'explore', 'adventure', 'lifestyle', 'trending', 'viral', 'fyp', 'reels', 'instagram', 'content', 'creator', 'community', 'follow', 'share'];
      const extras = modifiers.map(m => `#${words[0]?.replace(/[^a-z0-9]/g, '')}${m}`);

      const all = [...baseHashtags, ...combined, ...extras];
      const unique = [...new Set(all)].slice(0, count);

      return {
        result: unique.join(' ') + `\n\n(${unique.length} hashtags — copy and paste directly into Instagram)`,
        type: 'text',
      };
    },
  },

  convertCase: {
    fields: [
      { name: 'text', label: 'Input Text', type: 'textarea', placeholder: 'Enter your text here...' },
    ],
    handler: async (data) => {
      const text: string = data.text || '';
      if (!text.trim()) return { error: 'Please enter some text' };
      const toTitle = (s: string) => s.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
      const toCamel = (s: string) => s.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (m, i) => i === 0 ? m.toLowerCase() : m.toUpperCase()).replace(/\s+/g, '');
      const toPascal = (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, m => /\s+/.test(m) ? '' : m.toUpperCase());
      const toSnake = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_');
      const toKebab = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '-');
      return {
        result: `UPPERCASE:\n${text.toUpperCase()}\n\nlowercase:\n${text.toLowerCase()}\n\nTitle Case:\n${toTitle(text)}\n\ncamelCase:\n${toCamel(text)}\n\nPascalCase:\n${toPascal(text)}\n\nsnake_case:\n${toSnake(text)}\n\nkebab-case:\n${toKebab(text)}`,
        type: 'text',
      };
    },
  },

  generateLoremIpsum: {
    fields: [
      { name: 'type', label: 'Generate', type: 'select', options: [{label:'Words', value:'words'}, {label:'Sentences', value:'sentences'}, {label:'Paragraphs', value:'paragraphs'}], defaultValue: 'paragraphs' },
      { name: 'count', label: 'Count', type: 'number', defaultValue: 3, min: 1, max: 20 },
    ],
    handler: async (data) => {
      const count = Math.min(20, Math.max(1, parseInt(data.count) || 3));
      const rnd = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const genWord = () => rnd(loremWords);
      const genSentence = () => {
        const len = Math.floor(Math.random() * 10) + 5;
        const words = Array.from({ length: len }, genWord);
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(' ') + '.';
      };
      const genParagraph = () => Array.from({ length: Math.floor(Math.random() * 4) + 3 }, genSentence).join(' ');
      let result = '';
      if (data.type === 'words') result = Array.from({ length: count }, genWord).join(' ');
      else if (data.type === 'sentences') result = Array.from({ length: count }, genSentence).join(' ');
      else result = Array.from({ length: count }, genParagraph).join('\n\n');
      return { result, type: 'text' };
    },
  },

  generateMD5: {
    fields: [
      { name: 'text', label: 'Input Text', type: 'textarea', placeholder: 'Enter text to hash...' },
    ],
    handler: async (data) => {
      if (!data.text?.trim()) return { error: 'Please enter text to hash' };
      const hash = md5(data.text);
      return {
        result: `MD5 Hash:\n${hash}\n\nCharacters: ${data.text.length}\nHash Length: 32 characters`,
        type: 'text',
      };
    },
  },

  convertBinary: {
    fields: [
      { name: 'from', label: 'Convert From', type: 'select', options: [
        {label:'Decimal (Base 10)', value:'decimal'},
        {label:'Binary (Base 2)', value:'binary'},
        {label:'Octal (Base 8)', value:'octal'},
        {label:'Hexadecimal (Base 16)', value:'hexadecimal'},
      ], defaultValue: 'decimal' },
      { name: 'value', label: 'Input Value', type: 'text', placeholder: '255' },
    ],
    handler: async (data) => {
      const value = data.value?.trim();
      if (!value) return { error: 'Please enter a value to convert' };
      const baseMap: Record<string, number> = { decimal: 10, binary: 2, octal: 8, hexadecimal: 16 };
      const fromBase = baseMap[data.from] || 10;
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return { error: `Invalid ${data.from} value: "${value}"` };
      if (decimal < 0) return { error: 'Negative numbers are not supported' };
      return {
        result: `Decimal (Base 10): ${decimal}\nBinary (Base 2): ${decimal.toString(2)}\nOctal (Base 8): ${decimal.toString(8)}\nHexadecimal (Base 16): ${decimal.toString(16).toUpperCase()}`,
        type: 'text',
      };
    },
  },
};
