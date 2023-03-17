import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "../services/voucherService";

describe("Testing vouchers service", () => {

    it("Should respond with 'Voucher already exist' if voucher already exists", async () => {
            const voucher = {
                id: 1,
                code: 'Voucher123',
                discount: 25,
                used: false,
            }
    
            jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockResolvedValueOnce(voucher);
    
          const result = voucherService.createVoucher(voucher.code, voucher.discount);
          expect(result).rejects.toEqual({message: "Voucher already exist.", type: "conflict"}
          );
    });

    it("Should create a new voucher if voucher code does not exists", async () => {
        const voucher = {
            id: 50,
            code: 'cheque_sem_fundo_do_mario_123',
            discount: 15,
            used: false,
        }

        jest
        .spyOn(voucherRepository, "getVoucherByCode")
        .mockImplementationOnce((): any => {
            return undefined
        });

        jest
        .spyOn(voucherRepository, "createVoucher")
        .mockImplementationOnce((): any => {
            return voucher
        });

      const result = await voucherRepository.createVoucher(voucher.code, voucher.discount);
      expect(result).toEqual(voucher);
    });
});