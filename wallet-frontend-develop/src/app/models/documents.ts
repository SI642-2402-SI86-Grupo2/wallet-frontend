
export class Documents {
  id: number;
  document_type: string;
  financial_institutions_name: string;
  number: string;
  series: string;
  issuer_name: string;
  issuer_ruc: string;
  currency: string;
  amount: number;
  igv: number;
  issue_date: Date;
  due_date: Date;
  discount_date: Date;
  payment_terms: string;
  nominal_rate: number;
  effective_rate: number;
  tcea: number;
  status: string;
  initial_costs: string;
  final_costs: string;
  portfolios_id: number;

  constructor(
    id: number,
    document_type: string,
    financial_institutions_name: string,
    number: string,
    series: string,
    issuer_name: string,
    issuer_ruc: string,
    currency: string,
    amount: number,
    igv: number,
    issue_date: Date,
    due_date: Date,
    discount_date: Date,
    payment_terms: string,
    nominal_rate: number,
    effective_rate: number,
    tcea: number,
    status: string,
    initial_costs: string,
    final_costs: string,
    portfolios_id: number
  ) {
    this.id = id;
    this.document_type = document_type;
    this.financial_institutions_name = financial_institutions_name;
    this.number = number;
    this.series = series;
    this.issuer_name = issuer_name;
    this.issuer_ruc = issuer_ruc;
    this.currency = currency;
    this.amount = amount;
    this.igv = igv;
    this.issue_date = issue_date;
    this.due_date = due_date;
    this.discount_date = discount_date;
    this.payment_terms = payment_terms;
    this.nominal_rate = nominal_rate;
    this.effective_rate = effective_rate;
    this.tcea = tcea;
    this.status = status;
    this.initial_costs = initial_costs;
    this.final_costs = final_costs;
    this.portfolios_id = portfolios_id;
  }
}
