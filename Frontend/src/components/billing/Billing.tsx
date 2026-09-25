import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  ReceiptText,
  X,
} from "lucide-react";

type Bill = {
  id: string;
  service: string;
  provider: string;
  date: string;
  amount: number;
  status: "Due" | "Paid" | "Insurance pending";
};

const initialBills: Bill[] = [
  {
    id: "CB-21984",
    service: "Primary care visit",
    provider: "Dr. Maya Chen",
    date: "Sep 12, 2026",
    amount: 42,
    status: "Due",
  },
  {
    id: "CB-21871",
    service: "Cardiology consultation",
    provider: "Dr. James Park",
    date: "Aug 28, 2026",
    amount: 0,
    status: "Insurance pending",
  },
  {
    id: "CB-21640",
    service: "Laboratory services",
    provider: "CareBridge Labs",
    date: "Aug 14, 2026",
    amount: 28.5,
    status: "Paid",
  },
];

export default function Billing() {
  const [bills, setBills] = useState(initialBills);
  const [filter, setFilter] = useState<
    "All" | "Due" | "Paid" | "Insurance pending"
  >("All");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentBill, setPaymentBill] = useState<Bill | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const visibleBills = useMemo(() => {
    if (filter === "All") {
      return bills;
    }

    return bills.filter((bill) => bill.status === filter);
  }, [bills, filter]);

  const currentBalance = bills
    .filter((bill) => bill.status === "Due")
    .reduce((total, bill) => total + bill.amount, 0);

  const payBill = () => {
    if (!paymentBill) {
      return;
    }

    setBills((current) =>
      current.map((bill) =>
        bill.id === paymentBill.id
          ? { ...bill, status: "Paid" as const }
          : bill,
      ),
    );

    setPaymentComplete(true);
  };

  const closePayment = () => {
    setPaymentBill(null);
    setPaymentComplete(false);
  };

  const downloadStatement = (bill: Bill) => {
    const statement = [
      "CareBridge Billing Statement",
      "",
      `Statement: ${bill.id}`,
      `Service: ${bill.service}`,
      `Provider: ${bill.provider}`,
      `Date: ${bill.date}`,
      `Status: ${bill.status}`,
      `Patient responsibility: $${bill.amount.toFixed(2)}`,
    ].join("\n");

    const blob = new Blob([statement], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${bill.id}-statement.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="billing-page">
      <div className="billing-hero">
        <div>
          <small>PATIENT BILLING</small>
          <h2>Billing & payments</h2>
          <p>
            Review balances, recent statements, and payment activity in one
            place.
          </p>
        </div>

        <div className="billing-balance">
          <span>Current balance</span>
          <strong>${currentBalance.toFixed(2)}</strong>
          <small>Patient responsibility</small>
        </div>
      </div>

      <div className="billing-summary-grid">
        <article>
          <span className="billing-summary-icon">
            <CreditCard />
          </span>
          <div>
            <small>Amount due</small>
            <strong>${currentBalance.toFixed(2)}</strong>
          </div>
        </article>

        <article>
          <span className="billing-summary-icon">
            <ReceiptText />
          </span>
          <div>
            <small>Statements</small>
            <strong>{bills.length}</strong>
          </div>
        </article>

        <article>
          <span className="billing-summary-icon">
            <CheckCircle2 />
          </span>
          <div>
            <small>Paid</small>
            <strong>
              {bills.filter((bill) => bill.status === "Paid").length}
            </strong>
          </div>
        </article>
      </div>

      <div className="billing-toolbar">
        <div>
          <h3>Statements</h3>
          <p>View your recent billing activity.</p>
        </div>

        <label className="billing-filter">
          <span>Status</span>

          <div>
            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value as
                    | "All"
                    | "Due"
                    | "Paid"
                    | "Insurance pending",
                )
              }
            >
              <option>All</option>
              <option>Due</option>
              <option>Paid</option>
              <option>Insurance pending</option>
            </select>

            <ChevronDown />
          </div>
        </label>
      </div>

      <div className="billing-list">
        {visibleBills.map((bill) => (
          <article className="billing-card" key={bill.id}>
            <span className="billing-file-icon">
              <FileText />
            </span>

            <div className="billing-card-main">
              <div>
                <h3>{bill.service}</h3>
                <p>{bill.provider}</p>
              </div>

              <div className="billing-meta">
                <span>{bill.date}</span>
                <small>{bill.id}</small>
              </div>
            </div>

            <div className="billing-card-right">
              <strong>${bill.amount.toFixed(2)}</strong>
              <span
                className={`billing-status ${bill.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {bill.status}
              </span>
            </div>

            <div className="billing-actions">
              <button onClick={() => setSelectedBill(bill)}>
                View details
              </button>

              <button onClick={() => downloadStatement(bill)}>
                <Download />
                Statement
              </button>

              {bill.status === "Due" && (
                <button
                  className="billing-pay-button"
                  onClick={() => setPaymentBill(bill)}
                >
                  Pay now
                </button>
              )}
            </div>
          </article>
        ))}

        {!visibleBills.length && (
          <div className="billing-empty">
            No statements match this status.
          </div>
        )}
      </div>

      {selectedBill && (
        <div
          className="billing-modal-backdrop"
          onClick={() => setSelectedBill(null)}
        >
          <div
            className="billing-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="billing-modal-close"
              onClick={() => setSelectedBill(null)}
            >
              <X />
            </button>

            <small>STATEMENT DETAILS</small>
            <h2>{selectedBill.service}</h2>

            <div className="billing-detail-grid">
              <span>
                Provider
                <strong>{selectedBill.provider}</strong>
              </span>

              <span>
                Service date
                <strong>{selectedBill.date}</strong>
              </span>

              <span>
                Statement
                <strong>{selectedBill.id}</strong>
              </span>

              <span>
                Status
                <strong>{selectedBill.status}</strong>
              </span>
            </div>

            <div className="billing-detail-total">
              <span>Patient responsibility</span>
              <strong>${selectedBill.amount.toFixed(2)}</strong>
            </div>

            <button
              className="billing-primary"
              onClick={() => downloadStatement(selectedBill)}
            >
              <Download />
              Download statement
            </button>
          </div>
        </div>
      )}

      {paymentBill && (
        <div className="billing-modal-backdrop" onClick={closePayment}>
          <div
            className="billing-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="billing-modal-close" onClick={closePayment}>
              <X />
            </button>

            {!paymentComplete ? (
              <>
                <small>SECURE PAYMENT</small>
                <h2>Pay ${paymentBill.amount.toFixed(2)}</h2>
                <p>
                  This is a frontend demonstration. No real payment will be
                  processed.
                </p>

                <div className="billing-demo-card">
                  <CreditCard />
                  <div>
                    <strong>Demo payment method</strong>
                    <span>Visa ending in 4242</span>
                  </div>
                </div>

                <button className="billing-primary" onClick={payBill}>
                  Pay ${paymentBill.amount.toFixed(2)}
                </button>
              </>
            ) : (
              <div className="billing-payment-success">
                <CheckCircle2 />
                <h2>Payment complete</h2>
                <p>
                  Your demo payment has been recorded in the frontend.
                </p>

                <button className="billing-primary" onClick={closePayment}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}