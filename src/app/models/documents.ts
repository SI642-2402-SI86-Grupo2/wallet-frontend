import { Portfolios } from './portfolios';

export class Documents {
  documents_id: number;
  document_type: string;
  financial_institutions_name: string;
  number: string;
  series: string;
  issuer_name: string;
  issuer_ruc: string;
  currecy: string;
  amount: number;
  igv: number;
  issue_date: Date;
  due_date: Date;
  discount_date: Date;
  payment_terms: string;
  nominal_rate: number;
  effective_rate: number;
  tcea: number;
  commission: number;
  status: string;
  portfolios_id: Portfolios;

  constructor(
    documents_id: number,
    document_type: string,
    financial_institutions_name: string,
    number: string,
    series: string,
    issuer_name: string,
    issuer_ruc: string,
    currecy: string,
    amount: number,
    igv: number,
    issue_date: Date,
    due_date: Date,
    discount_date: Date,
    payment_terms: string,
    nominal_rate: number,
    effective_rate: number,
    tcea: number,
    commission: number,
    status: string,
    portfolios_id: Portfolios
  ) {
    this.documents_id = documents_id;
    this.document_type = document_type;
    this.financial_institutions_name = financial_institutions_name;
    this.number = number;
    this.series = series;
    this.issuer_name = issuer_name;
    this.issuer_ruc = issuer_ruc;
    this.currecy = currecy;
    this.amount = amount;
    this.igv = igv;
    this.issue_date = issue_date;
    this.due_date = due_date;
    this.discount_date = discount_date;
    this.payment_terms = payment_terms;
    this.nominal_rate = nominal_rate;
    this.effective_rate = effective_rate;
    this.tcea = tcea;
    this.commission = commission;
    this.status = status;
    this.portfolios_id = portfolios_id;
  }
}
