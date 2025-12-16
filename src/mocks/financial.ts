export interface TrainerPayment {
    id: string;
    trainerName: string;
    trainerEmail: string;
    subscriptionStatus: "Active" | "Inactive" | "Past Due";
    paidAmount: number;
    currency: string;
    month: string;
    paymentDate: string;
}

export const mockPayments: TrainerPayment[] = [
    {
        id: "1",
        trainerName: "John Doe",
        trainerEmail: "john@example.com",
        subscriptionStatus: "Active",
        paidAmount: 49.99,
        currency: "USD",
        month: "December 2025",
        paymentDate: "2025-12-01",
    },
    {
        id: "2",
        trainerName: "Jane Smith",
        trainerEmail: "jane@example.com",
        subscriptionStatus: "Active",
        paidAmount: 49.99,
        currency: "USD",
        month: "December 2025",
        paymentDate: "2025-12-02",
    },
    {
        id: "3",
        trainerName: "Bob Wilson",
        trainerEmail: "bob@example.com",
        subscriptionStatus: "Inactive",
        paidAmount: 0,
        currency: "USD",
        month: "December 2025",
        paymentDate: "-",
    },
    {
        id: "4",
        trainerName: "Alice Brown",
        trainerEmail: "alice@example.com",
        subscriptionStatus: "Past Due",
        paidAmount: 0,
        currency: "USD",
        month: "December 2025",
        paymentDate: "-",
    },
    {
        id: "5",
        trainerName: "Charlie Davis",
        trainerEmail: "charlie@example.com",
        subscriptionStatus: "Active",
        paidAmount: 49.99,
        currency: "USD",
        month: "December 2025",
        paymentDate: "2025-12-05",
    },
];
