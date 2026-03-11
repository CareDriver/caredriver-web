export enum LicenseCategories {
  CategoryP = "Categoría P (Profesional)",
  CategoryA = "Categoría A (Particular)",
  CategoryB = "Categoría B (Particular)",
  CategoryC = "Categoría C (Particular)",
  CategoryM = "Categoría M (Motociclista)",
  CategoryT = "Categoría T (Transporte Público)",
}

export const licenseCategoriesList = [
  LicenseCategories.CategoryP,
  LicenseCategories.CategoryA,
  LicenseCategories.CategoryB,
  LicenseCategories.CategoryC,
  LicenseCategories.CategoryM,
  LicenseCategories.CategoryT,
];

export function getLicenseCategoryLabel(category: LicenseCategories): string {
  switch (category) {
    case LicenseCategories.CategoryM:
      return "Categoría M - Motos";
    case LicenseCategories.CategoryP:
      return "Categoría P - Uso Particular";
    case LicenseCategories.CategoryA:
      return "Categoría A - Conduce Auto de terceros";
    case LicenseCategories.CategoryB:
      return "Categoría B - Camionetas, minubuses carga";
    case LicenseCategories.CategoryC:
      return "Categoría C - Buses y camiones";
    case LicenseCategories.CategoryT:
      return "Categoría T - Maquinaria pesada";
    default:
      return "Categoría desconocida";
  }
}
