export const preferenceValues = ["reject", "approve", "neutral"];

export const preferenceExplainers: Record<string, string> = {
  approve:
    "La afirmación se comparte como apoyo a la opción 'Apruebo' del plebiscito.",
  reject:
    "La afirmación se comparte como apoyo a la opción 'Rechazo' del plebiscito.",
  neutral:
    "La afirmación no se comparte como apoyo a ninguna opción del plebiscito, o no fue posible determinarlo.",
};

export const rawPreferenceMap: Record<string, string> = {
  approve: "Apruebo",
  reject: "Rechazo",
  neutral: "Neutral",
};
