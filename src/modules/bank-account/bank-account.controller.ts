import "dotenv/config";
import type { RequestHandler } from "express";
import { BankAccountService } from "./bank-account.service.js";
import monoApiConfig from "../../config/mono.config.js";
import mongoose from "mongoose";
import { AppError } from "../../shared/utils/app.error.js";
import { MonoRequestService } from "../mono-request/mono-request.service.js";
import { Status } from "../mono-request/mono-request.model.js";
import { BankAccountStatus } from "./bank-account.model.js";

// export const linkBankAccount: RequestHandler = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const { name, email, institution } = req.body; // the email here should be phone_number

//     const metaRef = await generateRefSlug();

//     const monoRequest = await MonoRequest.create({
//       userId: user?.id || "",
//       metaRef,
//       status: "initiated",
//     });

//     const monoAccountLink = await monoApiConfig({
//       version: "v2",
//       endpoint: "accounts/initiate",
//       data: {
//         customerDetails: {
//           name: name,
//           email: email, // Actually phone number
//         },
//         scope: "auth",
//         redirectUrl: `${process.env.FRONTEND_URL}/bank-account/link/callback`,
//         metaRef,
//         institutionDetails: {
//           id: institution.id,
//           auth_method: institution.auth_method,
//         },
//       },
//     });

//     if (monoAccountLink.status === "successful") {
//       const { mono_url, customer, scope, is_multi } = monoAccountLink.data;

//       await MonoRequest.findByIdAndUpdate(monoRequest._id, {
//         monoCustomerId: customer,
//         monoUrl: mono_url,
//         scope,
//         isMulti: is_multi,
//         status: "successful",
//       });

//       res.json({
//         message: "Bank account linking initiated successfully",
//         data: monoAccountLink.data,
//       });
//     } else {
//       res.status(400).json({
//         message: "Failed to initiate bank account linking",
//         error: monoAccountLink.data,
//       });
//     }
//   } catch (error: any) {
//     next(error);
//   }
// };

// export const verifyBankAccount: RequestHandler = async (req, res, next) => {
//   try {
//     const { code } = req.body;

//     if (!code) {
//       throw new AppError("Code is required", 400);
//     }

//     const exchange = await monoApiConfig({
//       version: "v2",
//       endpoint: "accounts/auth",
//       data: { code },
//     });

//     await BankAccount.create({
//       userId: req.user?.id || "",
//       monoAccountId: exchange.data.account.id,
//       status: "linked",
//     });

//     res.json({ message: "Bank account linked successfully" });
//   } catch (error: any) {
//     next(error);
//   }
// };

export type MonoExchangeResponse = {
  status: string;
  data: {
    id: string;
  };
};

export class BankAccountController {
  private service: BankAccountService;
  private monoRequestService: MonoRequestService;

  constructor() {
    this.service = new BankAccountService();
    this.monoRequestService = new MonoRequestService();
  }

  public monoWebhook: RequestHandler = async (req, res, next) => {
    try {
      const monoSignature = req.headers["mono-webhook-secret"] as string;
      if (monoSignature !== process.env.MONO_WEBHOOK_SECRET) {
        throw new AppError("Unauthorized", 401);
      }

      const { event, data } = req.body;

      switch (event) {
        case "mono.events.account_connected": {
          const { code, meta } = data;

          console.log({ code, meta });

          const exchangeResponse: MonoExchangeResponse = await monoApiConfig({
            version: "v2",
            endpoint: "accounts/auth",
            data: {
              code,
            },
          });

          const monoAccountId = exchangeResponse.data.id;

          const accountDetails = await monoApiConfig({
            version: "v2",
            endpoint: `accounts/${monoAccountId}`,
            data: {},
          });

          const monoRequest = await this.monoRequestService.updateMonoRequest(
            meta.metaRef,
            {
              status: Status.SUCCESSFUL,
            },
          );

          await this.service.createBankAccount({
            userId: new mongoose.Types.ObjectId(monoRequest?.userId || ""),
            monoAccountId,
            status: BankAccountStatus.LINKED,
            institution: {
              monoId: accountDetails.data.institution.id,
              name: accountDetails.data.institution.name,
              bankCode: accountDetails.data.institution.bank_code,
              type: accountDetails.data.institution.type,
            },
          });

          break;
        }

        case "mono.events.account_unlinked": {
          const { account_id, meta } = data;

          await this.service.updateBankAccount(account_id, {
            status: BankAccountStatus.UNLINKED,
          });

          break;
        }
      }
    } catch (error: any) {
      next(error);
    }
  };

  //   public verifyBankAccount: RequestHandler = async (req, res, next) => {
  //     try {
  //       const { code } = req.body;

  //       if (!code) {
  //         throw new Error("Verification code is required");
  //       }

  //       const exchangeResponse = await monoApiConfig({
  //         version: "v2",
  //         endpoint: "accounts/auth",
  //         data: {
  //           code,
  //         },
  //       });

  //       await this.service.createBankAccount({
  //         userId: new mongoose.Types.ObjectId(req.user?.id || ""),
  //         monoAccountId: exchangeResponse.data.account.id,
  //         status: BankAccountStatus.LINKED,
  //       });

  //       res.json({ message: "Bank account linked successfully" });
  //     } catch (error: any) {
  //       next(error);
  //     }
  //   };
}
