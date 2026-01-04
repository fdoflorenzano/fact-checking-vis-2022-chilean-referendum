export const verificationValues = [
  "true",
  "inaccurate",
  "misleading",
  "creative",
  "false",
];
export const verificationExplainers: Record<string, string> = {
  false:
    "La afirmación ha mostrado ser falsa tras ser verificada con las fuentes disponibles y expert@s.",
  creative:
    "La afirmación puede nacer de un dato verificable o de un hecho constatable, pero se exageran o combinan con falsedades.",
  misleading:
    "La afirmación contiene datos verificables, pero la interpretación que se hace de ellos, el contexto en que se sitúan, las proyecciones que se realizan con ellos o las correlaciones no son verificables.",
  inaccurate:
    "En términos generales la afirmación es correcta, debido a que se puede verificar con las fuentes disponibles y experto/as, pero hay datos imprecisos, omitidos o falta contexto.",
  true: "La afirmación expresada es correcta al ser verificada con las fuentes disponibles y expert@s.",
};

export const rawVerificationMap: Record<string, string> = {
  true: "Verdadero",
  inaccurate: "Impreciso",
  misleading: "Engañoso",
  creative: "Se puso creativ@",
  false: "Falso",
};
