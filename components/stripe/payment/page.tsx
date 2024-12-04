import { redirect } from "next/navigation";
import { FailedComponent } from "./_components/failed";
import { SuccessComponent } from "./_components/success";

interface PaymentProps {
  searchParams: { status: string; token?: string; PayerID?: string };
}

export default function Payment({ searchParams }: PaymentProps) {
  const status = searchParams.status;
  const token = searchParams.token;
  const payerId = searchParams.PayerID;

  if (status == "failed") {
    return <FailedComponent />;
  }

  if (status == "success") {
    return <SuccessComponent />;
  }

  return redirect("/");
}