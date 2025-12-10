export interface LegalContent {
	_id?: string;
	content: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateLegalContentRequest {
	content: string;
}

export interface UpdateLegalContentRequest {
	content: string;
}

// For Terms and Conditions
export type TermsAndCondition = LegalContent;
export type CreateTermsRequest = CreateLegalContentRequest;
export type UpdateTermsRequest = UpdateLegalContentRequest;

// For Privacy Policy
export type PrivacyPolicy = LegalContent;
export type CreatePrivacyRequest = CreateLegalContentRequest;
export type UpdatePrivacyRequest = UpdateLegalContentRequest;
