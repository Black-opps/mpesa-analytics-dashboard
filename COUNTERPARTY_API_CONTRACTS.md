/*
 * BACKEND API CONTRACTS - Counterparty Intelligence
 * 
 * These endpoints should be implemented in your backend services
 * 
 * GET /api/v1/counterparties/search?q={query}
 * Query parameters:
 *   - q: string (name or phone number, min 3 characters)
 *   
 * Response:
 * {
 *   id: string,
 *   name: string,
 *   phone: string,
 *   totalSent: number,
 *   totalReceived: number,
 *   transactionCount: number,
 *   firstSeen: string,
 *   lastSeen: string,
 *   relationshipScore: number,
 *   category: "personal" | "business" | "merchant"
 * }
 * 
 * GET /api/v1/counterparties/{id}/transactions
 * Response: Array of transactions
 * 
 * GET /api/v1/counterparties/{id}/insights
 * Response: AI-generated insights about this counterparty
 * 
 * Security: All endpoints require JWT authentication
 * Rate limiting: 100 requests per minute per user
 */
