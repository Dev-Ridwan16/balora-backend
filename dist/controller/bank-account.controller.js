import dotenv from "dotenv";
import monoApiConfig from "../config/mono.config.js";
import { generateRefSlug } from "../utils/constant.js";
import MonoRequest from "../models/monoRequest.model.js";
import { AppError } from "../utils/app.error.js";
import BankAccount from "../models/bank-account.model.js";
dotenv.config();
export const linkBankAccount = async (req, res, next) => {
    try {
        const user = req.user;
        const { name, email, institution } = req.body; // the email here should be phone_number
        const metaRef = await generateRefSlug();
        const monoRequest = await MonoRequest.create({
            userId: user?.id || "",
            metaRef,
            status: "initiated",
        });
        const monoAccountLink = await monoApiConfig({
            version: "v2",
            endpoint: "accounts/initiate",
            data: {
                customerDetails: {
                    name: name,
                    email: email, // Actually phone number
                },
                scope: "auth",
                redirectUrl: `${process.env.FRONTEND_URL}/bank-account/link/callback`,
                metaRef,
                institutionDetails: {
                    id: institution.id,
                    auth_method: institution.auth_method,
                },
            },
        });
        if (monoAccountLink.status === "successful") {
            const { mono_url, customer, scope, is_multi } = monoAccountLink.data;
            await MonoRequest.findByIdAndUpdate(monoRequest._id, {
                monoCustomerId: customer,
                monoUrl: mono_url,
                scope,
                isMulti: is_multi,
                status: "successful",
            });
            res.json({
                message: "Bank account linking initiated successfully",
                data: monoAccountLink.data,
            });
        }
        else {
            res.status(400).json({
                message: "Failed to initiate bank account linking",
                error: monoAccountLink.data,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
export const verifyBankAccount = async (req, res, next) => {
    try {
        const { code } = req.body;
        if (!code) {
            throw new AppError("Code is required", 400);
        }
        const exchange = await monoApiConfig({
            version: "v2",
            endpoint: "accounts/auth",
            data: { code },
        });
        await BankAccount.create({
            userId: req.user?.id || "",
            monoAccountId: exchange.data.account.id,
            status: "linked",
        });
        res.json({ message: "Bank account linked successfully" });
    }
    catch (error) {
        next(error);
    }
};
