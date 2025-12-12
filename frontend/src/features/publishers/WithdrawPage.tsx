"use client";

import { BaseLayout } from "@/shared/components/layouts/BaseLayout";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Button } from "@/shared/components/shadcn/button";
import { useState, useEffect, useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract, prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";
import { toast } from "sonner";
import { TesseraFeeSplitter } from "@/src/contracts/TesseraFeeSplitter";
import { publisherService } from "@/shared/services/publisherService";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const avalancheFuji = defineChain(43113);

export function WithdrawPage() {
  const account = useActiveAccount();
  const [balance, setBalance] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [publisherContractAddress, setPublisherContractAddress] = useState<string | null>(null);

  useEffect(() => {
    console.log("ENTREI AQUI", account)
    const fetchPublisherContractAddress = async () => {
      if (!account?.address) return;

      try {
        const publisher = await publisherService.getPublisherByWalletAddress(account.address);
        console.log("publisher22", publisher)
        if (publisher?.contract_address) {
          console.log("publisherContractAddress", publisher.contract_address)
          fetchBalance(publisher.contract_address);
          setPublisherContractAddress(publisher.contract_address);
        } else {
          toast.error("Contrato do publisher não encontrado. Entre em contato com o suporte.");
        }
      } catch (error) {
        console.error("Error fetching publisher contract:", error);
        toast.error("Falha ao carregar informações do publisher");
      }
    };

    fetchPublisherContractAddress();
  }, [account?.address]);

  const fetchBalance = async (publisherContractAddress: string) => {
    if (!account || !publisherContractAddress) return;
    console.log("passou")

    const contractInstance = getContract({
      client,
      chain: avalancheFuji,
      address: publisherContractAddress,
      abi: TesseraFeeSplitter.abi as any,
    });

    try {
      setIsFetching(true);
      const balanceResult = await readContract({
        contract:contractInstance,
        method: "function getBalance() view returns (uint256)",
        params: [],
      });
      console.log("balanceResult", balanceResult)

      // Converter de wei para USDC (6 decimais)
      const balanceInUsdc = Number(balanceResult) / 1e6;
      console.log("balanceInUsdc", balanceInUsdc)
      setBalance(balanceInUsdc.toFixed(2));
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Erro ao buscar saldo disponível");
    } finally {
      setIsFetching(false);
    }
  };



  const handleWithdraw = async () => {
    if (!account || !publisherContractAddress) {
      return;
    }
    const contractInstance = getContract({
      client,
      chain: avalancheFuji,
      address: publisherContractAddress,
      abi: TesseraFeeSplitter.abi as any,
    });

    try {
      setIsLoading(true);
      toast.info("Preparando transação...");

      const transaction = prepareContractCall({
        contract: contractInstance,
        method: "function distribute()",
        params: [],
      });

      toast.info("Aguardando confirmação...");
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });
      console.log("transactionHash", transactionHash)

      toast.info("Processando transação...");
      const receipt = await waitForReceipt({
        client,
        chain: avalancheFuji,
        transactionHash,
      });
      console.log("receipt", receipt)
      toast.success("Withdraw realizado com sucesso!");

      // Atualizar o saldo após o withdraw
      await fetchBalance(publisherContractAddress);
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
