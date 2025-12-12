"use client"

import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, waitForReceipt, prepareEvent, parseEventLogs } from "thirdweb"
import { avalancheFuji } from "thirdweb/chains"
import type { Account } from "thirdweb/wallets"
import { TOKEN_ADDRESS, DEVS_ADDRESS, DEFAULT_PUBLISHER_BPS, DEFAULT_DEVS_BPS } from "@/shared/config/contracts"
import { publishersAdminService } from "@/shared/services/publishersAdminService"
import { logger } from "@/shared/utils/logger"
import { TesseraFeeSplitterFactory } from "@/src/contracts/TesseraFeeSplitterFactory"


interface CreateFeeSplitterParams {
  publisherId: string
  account: Account
}

/**
 * Creates a fee splitter contract for a publisher and approves the publisher
 * @param params - Object containing publisherId and account
 * @returns The address of the created fee splitter contract
 */
export const createFeeSplitter = async ({ publisherId, account }: CreateFeeSplitterParams): Promise<string> => {
  try {
    // Get publisher data to retrieve wallet address
    const publisher = await publishersAdminService.getPublisher(publisherId)
    if (!publisher.wallet_address) {
      throw new Error("Publisher wallet address is required")
    }

    // Initialize thirdweb client
    const client = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
    })

    // Get the contract instance
    const contract = getContract({
      client,
      chain: avalancheFuji,
      address: TesseraFeeSplitterFactory.address,
      abi: TesseraFeeSplitterFactory.abi as any, //TODO: Fix this
    })

    // Prepare the contract call
    const transaction = prepareContractCall({
      contract,
      method: "createSplitter",
      params: [
        TOKEN_ADDRESS,
        publisher.wallet_address,
        DEVS_ADDRESS,
        DEFAULT_PUBLISHER_BPS,
        DEFAULT_DEVS_BPS,
      ],
    })

    
    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    })
    // Wait for transaction receipt
    const receipt = await waitForReceipt({
      chain: avalancheFuji,
      transactionHash,
      client,
    })


    // Prepare the SplitterCreated event from the ABI
    const splitterCreatedEvent = prepareEvent({
      signature: "event SplitterCreated(address indexed creator, address splitter)",
    })

    // Parse events from the receipt logs
    const events = parseEventLogs({
      logs: receipt.logs,
      events: [splitterCreatedEvent],
    })

    // Extract the splitter address from the event
    const splitterCreated = events.find(
      (event) => event.eventName === "SplitterCreated"
    )

    if (!splitterCreated) {
      throw new Error("SplitterCreated event not found in transaction receipt")
    }

    const splitterAddress = splitterCreated.args.splitter as string

    // Approve the publisher with the splitter contract address
    await publishersAdminService.approvePublisher(publisherId, splitterAddress)

    return splitterAddress
  } catch (error) {
    logger.error("Failed to create fee splitter", error, {
      showToast: true,
      toastMessage: "Failed to create fee splitter contract",
    })
    throw error
  }
}