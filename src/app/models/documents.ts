export class Documents {
  id: number;
  documentType: string;
  financialInstitutionsName: string;
  number: string;
  series: string;
  issuerName: string;
  issuerRuc: string;
  currency: string;
  amount: number;
  igv: number;
  issueDate: Date;
  dueDate: Date;
  discountDate: Date;
  paymentTerms: string;
  nominalRate: number;
  effectiveRate: number;
  tcea: number;
  status: string;
  initialCosts: string;
  finalCosts: string;
  portfolioId: number;

  constructor(
    id: number,
    documentType: string,
    financialInstitutionsName: string,
    number: string,
    series: string,
    issuerName: string,
    issuerRuc: string,
    currency: string,
    amount: number,
    igv: number,
    issueDate: Date,
    dueDate: Date,
    discountDate: Date,
    paymentTerms: string,
    nominalRate: number,
    effectiveRate: number,
    tcea: number,
    status: string,
    initialCosts: string,
    finalCosts: string,
    portfolioId: number
  ) {
    this.id = id;
    this.documentType = documentType;
    this.financialInstitutionsName = financialInstitutionsName;
    this.number = number;
    this.series = series;
    this.issuerName = issuerName;
    this.issuerRuc = issuerRuc;
    this.currency = currency;
    this.amount = amount;
    this.igv = igv;
    this.issueDate = issueDate;
    this.dueDate = dueDate;
    this.discountDate = discountDate;
    this.paymentTerms = paymentTerms;
    this.nominalRate = nominalRate;
    this.effectiveRate = effectiveRate;
    this.tcea = tcea;
    this.status = status;
    this.initialCosts = initialCosts;
    this.finalCosts = finalCosts;
    this.portfolioId = portfolioId;
  }
}
