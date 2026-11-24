export const taka = (t) => "\u09F3" + Math.round(t).toLocaleString("en-IN");

export const num = (t) => t.toLocaleString("en-IN");

export const formatLivingId = (t) => t.slice(0, 3) + " " + t.slice(3);

export const shortOrg = (t) =>
  t
    .replace("Daffodil International University", "DIU")
    .replace("North South University", "NSU")
    .replace("East West University", "EWU")
    .replace("BRAC University", "BRACU");

export const userTypes = {
  student: ["Student", "primary"],
  job: ["Job holder", "teal"],
  landlord: ["Landlord", "orange"],
};
