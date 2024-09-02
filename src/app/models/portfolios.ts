export class Portfolios {
  id: number;
  portfolio_name: string;
  description: string;
  discount_date: Date;
  total_tcea: number;
  users_id: number;


  constructor(id: number, portfolio_name: string, description: string, discount_date: Date, total_tcea: number, users_id: number) {
    this.id = id;
    this.portfolio_name = portfolio_name;
    this.description = description;
    this.discount_date = discount_date;
    this.total_tcea = total_tcea;
    this.users_id = users_id;

  }
}
