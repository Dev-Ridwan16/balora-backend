import type { RequestHandler } from "express";
import {
  MonoRequestService,
  type MonoRequestLinkResponse,
} from "./mono-request.service.js";
import { generateRefSlug } from "../../shared/utils/constant.js";
import mongoose from "mongoose";
import { Status } from "./mono-request.model.js";
import monoApiConfig from "../../config/mono.config.js";

export class MonoRequestController {
  private service: MonoRequestService;

  constructor() {
    this.service = new MonoRequestService();
  }

  public linkBankAccount: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.id!;

      const { name, email, institution } = req.body; // the email here should be phone_number
      const metaRef = await generateRefSlug();

      const monoRequest = await this.service.createMonoRequest({
        userId: new mongoose.Types.ObjectId(userId),
        metaRef,
        status: Status.INITIATED,
      });

      const linkAccountWithMono: MonoRequestLinkResponse = await monoApiConfig({
        version: "v2",
        endpoint: "accounts/initiate",
        data: {
          customerDetails: {
            name,
            email,
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

      if (linkAccountWithMono.status === "successful") {
        const { mono_url, customer, scope, is_multi } =
          linkAccountWithMono.data;

        await this.service.updateMonoRequest(monoRequest._id.toString(), {
          monoCustomerId: customer,
          monoUrl: mono_url,
          scope,
          isMulti: is_multi,
          status: Status.SUCCESSFUL,
        });

        res.json({
          message: "Bank account linking initiated successfully",
          data: linkAccountWithMono.data,
        });
      } else {
        res.status(400).json({
          message: "Failed to initiate bank account linking",
          error: linkAccountWithMono.data,
        });
      }
    } catch (error: any) {
      next(error);
    }
  };
}
