"use client";

import { BaseLayout } from "@/shared/components/layouts/BaseLayout";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Button } from "@/shared/components/shadcn/button";
import { useState, useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { toast } from "sonner";
import { TesseraFeeSplitter } from "@/src/contracts/TesseraFeeSplitter";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const avalancheFuji = defineChain(43113);

export function WithdrawPage() {
  const account = useActiveAccount();
  const [balance, setBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // TODO: Pegar o endereço do contrato do publisher logado
  // Por enquanto, usando um placeholder válido
  const publisherContractAddress = "0x0000000000000000000000000000000000000000"; // Substituir pelo endereço real do contrato do publisher

  const contract = getContract({
    client,
    chain: avalancheFuji,
    address: publisherContractAddress,
    abi: TesseraFeeSplitter.abi as any,
  });

  const fetchBalance = async () => {
    if (!account) return;

    try {
      setIsFetching(true);
      const balanceResult = await readContract({
        contract,
        method: "function getBalance() view returns (uint256)",
        params: [],
      });

      // Converter de wei para USDC (6 decimais)
      const balanceInUsdc = Number(balanceResult) / 1e6;
      setBalance(balanceInUsdc.toFixed(2));
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Erro ao buscar saldo disponível");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [account]);

  const handleWithdraw = async () => {
    if (!account) {
      toast.error("Conecte sua carteira");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Preparando transação...");

      const transaction = prepareContractCall({
        contract,
        method: "function distribute()",
        params: [],
      });

      toast.info("Aguardando confirmação...");
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      toast.info("Processando transação...");
      await waitForReceipt({
        client,
        chain: avalancheFuji,
        transactionHash,
      });

      toast.success("Withdraw realizado com sucesso!");

      // Atualizar o saldo após o withdraw
      await fetchBalance();
    } catch (error: any) {
      console.error("Error withdrawing:", error);
      toast.error(error.message || "Erro ao realizar withdraw");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseLayout title="Withdraw">
      <div className="space-y-6">
        <PageHeader
          title="Withdraw"
          description="Retire seus ganhos disponíveis"
        />

        <div className="flex flex-col items-center justify-center space-y-8 py-12">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <div className="text-6xl font-bold">
              {isFetching ? (
                <span className="text-muted-foreground">...</span>
              ) : (
                <>
                  ${balance}
                  <span className="text-2xl text-muted-foreground ml-2">USDC</span>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={isLoading || isFetching || parseFloat(balance) === 0}
            size="lg"
            className="px-12"
          >
            {isLoading ? "Processando..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
}
