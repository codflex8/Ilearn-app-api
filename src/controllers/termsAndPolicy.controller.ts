import expressAsync from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { PolicyAndTerms } from "../models/PolicyAndTerms.model";

export const getTerms = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const terms = await PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ terms: terms?.terms ?? "" });
  }
);

export const addTerms = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { terms: newTerms } = req.body;
    let terms: PolicyAndTerms = await PolicyAndTerms.findOne({
      where: {},
    });
    if (!terms) {
      terms = new PolicyAndTerms();
    }
    terms.terms = newTerms;
    await terms.save();
    res.status(200).json({ terms });
  }
);

export const getPolicy = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const policy = await PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ policy: policy?.policy ?? "" });
  }
);

export const addPolicy = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { policy: newPolicy, terms } = req.body;
    let policy: PolicyAndTerms = await PolicyAndTerms.findOne({
      where: {},
    });
    if (!policy) {
      policy = new PolicyAndTerms();
    }
    policy.policy = newPolicy;
    policy.terms = terms;
    await policy.save();
    res.status(200).json({ policy: policy?.policy ?? "" });
  }
);
