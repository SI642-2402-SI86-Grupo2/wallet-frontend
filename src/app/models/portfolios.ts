export class Portfolios {
  id: number;
  portfolioName: string;
  description: string;
  discountDate: Date;
  totalTcea: number;
  profileId: number;

  constructor(id: number, portfolioName: string, description: string, discountDate: Date, totalTcea: number, profileId: number) {
    this.id = id;
    this.portfolioName = portfolioName;
    this.description = description;
    this.discountDate = discountDate;
    this.totalTcea = totalTcea;
    this.profileId = profileId;
  }
}
