
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export enum AppPhase {
  SETUP = 'SETUP',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR'
}

export interface VoicePreference {
  name: string;
  code: string;
}

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'cmn-CN', name: '普通话 (中国) - Mandarin Chinese' },
  { code: 'en-US', name: '英语 (美国) - English (US)' },
  { code: 'ja-JP', name: '日语 (日本) - Japanese' },
  { code: 'ko-KR', name: '韩语 (韩国) - Korean' },
  { code: 'en-GB', name: '英语 (英国) - English (UK)' },
  { code: 'fr-FR', name: '法语 (法国) - French' },
  { code: 'de-DE', name: '德语 (德国) - German' },
  { code: 'it-IT', name: '意大利语 (意大利) - Italian' },
  { code: 'es-ES', name: '西班牙语 (西班牙) - Spanish (Spain)' },
  { code: 'es-US', name: '西班牙语 (美国) - Spanish (US)' },
  { code: 'pt-BR', name: '葡萄牙语 (巴西) - Portuguese (Brazil)' },
  { code: 'ru-RU', name: '俄语 (俄罗斯) - Russian' },
  { code: 'ar-XA', name: '阿拉伯语 - Arabic' },
  { code: 'hi-IN', name: '印地语 (印度) - Hindi' },
  { code: 'bn-IN', name: '孟加拉语 (印度) - Bengali' },
  { code: 'pa-IN', name: '旁遮普语 (印度) - Punjabi' },
  { code: 'tr-TR', name: '土耳其语 (土耳其) - Turkish' },
  { code: 'vi-VN', name: '越南语 (越南) - Vietnamese' },
  { code: 'th-TH', name: '泰语 (泰国) - Thai' },
  { code: 'id-ID', name: '印度尼西亚语 (印尼) - Indonesian' },
  { code: 'pl-PL', name: '波兰语 (波兰) - Polish' },
  { code: 'nl-NL', name: '荷兰语 (荷兰) - Dutch' },
  { code: 'sv-SE', name: '瑞典语 (瑞典) - Swedish' },
  { code: 'da-DK', name: '丹麦语 (丹麦) - Danish' },
  { code: 'fi-FI', name: '芬兰语 (芬兰) - Finnish' },
  { code: 'no-NO', name: '挪威语 - Norwegian' },
  { code: 'cs-CZ', name: '捷克语 - Czech' },
  { code: 'el-GR', name: '希腊语 - Greek' },
  { code: 'he-IL', name: '希伯来语 - Hebrew' },
  { code: 'uk-UA', name: '乌克兰语 - Ukrainian' },
];

export const AVAILABLE_VOICES = [
  'Achernar', 'Achird', 'Algenib', 'Algieba', 'Alnilam', 
  'Aoede', 'Autonoe', 'Callirrhoe', 'Charon', 'Despina', 
  'Enceladus', 'Erinome', 'Fenrir', 'Gacrux', 'Iapetus', 
  'Kore', 'Laomedeia', 'Leda', 'Orus', 'Pulcherrima', 
  'Puck', 'Rasalgethi', 'Sadachbia', 'Sadaltager', 'Schedar', 
  'Sulafat', 'Umbriel', 'Vindemiatrix', 'Zephyr', 'Zubenelgenubi'
];
