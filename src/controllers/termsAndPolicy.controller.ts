import expressAsync from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { PolicyAndTerms } from "../models/PolicyAndTerms.model";

export const getTermsAndPolicy = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const termsAndPolicy = await PolicyAndTerms.findOne({ where: {} });
    res.status(200).json({ termsAndPolicy });
  }
);

export const addTermsAndPolicy = expressAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { policy, terms } = req.body;
    let termsAndPolicy: PolicyAndTerms = await PolicyAndTerms.findOne({
      where: {},
    });
    if (!termsAndPolicy) {
      termsAndPolicy = new PolicyAndTerms();
    }
    termsAndPolicy.policy = policy;
    termsAndPolicy.terms = terms;
    await termsAndPolicy.save();
    res.status(200).json({ termsAndPolicy });
  }
);
