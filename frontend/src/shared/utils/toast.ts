import { toast as sonnerToast } from "sonner"

const createToastMethod = (method: typeof sonnerToast.success) => {
  return (message: string, description?: string) => {
    return method(message, { description })
  }
}

export const toast = {
  success: createToastMethod(sonnerToast.success),
  error: createToastMethod(sonnerToast.error),
  loading: createToastMethod(sonnerToast.loading),
  info: createToastMethod(sonnerToast.info),
  warning: createToastMethod(sonnerToast.warning),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
}
