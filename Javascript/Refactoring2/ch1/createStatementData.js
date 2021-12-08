class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
  get amountFor() {
    throw new Error("알수 없는 장르");
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amountFor() {
    let result = 40000;
    if (this.performance.audience > 30)
      result += 1000 * (this.performance.audience - 30);
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amountFor() {
    let result = 30000;
    if (this.performance.audience > 20)
      result += 10000 + 500 * (this.performance.audience - 20);
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

const createStatementData = (invoice, plays) => {
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  const totalAmount = (data) => {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  };

  const totalVolumeCredits = (data) => {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  };

  const createPerformanceCalculator = (aPerformance, aPlay) => {
    switch (aPlay.type) {
      case "tragedy":
        return new TragedyCalculator(aPerformance, aPlay);
      case "comedy":
        return new ComedyCalculator(aPerformance, aPlay);
      default:
        return new PerformanceCalculator(aPerformance, aPlay);
    }
  };

  const enrichPerformance = (aPerformance) => {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  };

  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);
  return result;
};

export default createStatementData;
