import { jest } from "@jest/globals";

import voucherService from "services/voucherService";
import voucherRepository from "repositories/voucherRepository";

describe("voucherService unitary tests", () => {
  it("should not apply discount for values below 100", async () => {
    const amount = 99;
    const voucher = {
      id: 1,
      code: "driven500",
      discount: 15,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => voucher);

    const order = await voucherService.applyVoucher("driven500", amount);

    expect(order).toEqual({
      amount: amount,
      discount: order.discount,
      finalAmount: amount,
      applied: order.applied,
    });
  });

  it("should not apply discount for invalid voucher", async () => {
    const amount = 100;
    const voucher = {
      id: 1,
      code: "driven500",
      discount: 15,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => undefined);

    const order = voucherService.applyVoucher(voucher.code, amount);
    expect(order).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });

  it("should apply discount", async () => {
    const amount = 115;
    const voucher = {
      id: 1,
      code: "driven500",
      discount: 15,
      used: false,
    };
    const finalAmount = amount - ((amount/100) * voucher.discount);
    const usedVoucher = {
      ...voucher,
      used: true,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => voucher);
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => usedVoucher);

    const order = await voucherService.applyVoucher(voucher.code, amount)
    expect(order).toEqual({
      amount: amount,
      discount: order.discount,
      finalAmount: finalAmount,
      applied: usedVoucher.used,
    })
  });
});