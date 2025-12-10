import type {
	CreatePrivacyRequest,
	CreateTermsRequest,
	PrivacyPolicy,
	TermsAndCondition,
	UpdatePrivacyRequest,
	UpdateTermsRequest,
} from "@/types/legal";
import apiClient from "../apiClient";

export enum LegalApi {
	TERMS = "/termAndCondition",
	PRIVACY = "/privacyPolicy",
}

const legalService = {
	// ========== Terms and Conditions ==========

	// Get terms and conditions
	getTermsAndConditions: async (): Promise<TermsAndCondition> => {
		console.log("🔍 [legalService] Fetching terms and conditions from:", LegalApi.TERMS);
		try {
			const result = await apiClient.get<TermsAndCondition>({
				url: LegalApi.TERMS,
			});
			console.log("✅ [legalService] Terms fetch successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Terms fetch failed:", error);
			throw error;
		}
	},

	// Create terms and conditions
	createTermsAndConditions: async (data: CreateTermsRequest): Promise<TermsAndCondition> => {
		console.log("🚀 [legalService] Creating terms and conditions with data:", data);
		try {
			const result = await apiClient.post<TermsAndCondition>({
				url: LegalApi.TERMS,
				data: { content: data.content }, // Ensure simple JSON structure
			});
			console.log("✅ [legalService] Terms create successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Terms create failed:", error);
			throw error;
		}
	},

	// Update terms and conditions
	updateTermsAndConditions: async (data: UpdateTermsRequest, id?: string): Promise<TermsAndCondition> => {
		console.log("🔄 [legalService] Updating terms and conditions with data:", data, "ID:", id);
		try {
			const url = id ? `${LegalApi.TERMS}/${id}` : LegalApi.TERMS;
			const result = await apiClient.put<TermsAndCondition>({
				url,
				data: { content: data.content }, // Ensure simple JSON structure
			});
			console.log("✅ [legalService] Terms update successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Terms update failed:", error);
			throw error;
		}
	},

	// ========== Privacy Policy ==========

	// Get privacy policy
	getPrivacyPolicy: async (): Promise<PrivacyPolicy> => {
		console.log("🔍 [legalService] Fetching privacy policy from:", LegalApi.PRIVACY);
		try {
			const result = await apiClient.get<PrivacyPolicy>({
				url: LegalApi.PRIVACY,
			});
			console.log("✅ [legalService] Privacy fetch successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Privacy fetch failed:", error);
			throw error;
		}
	},

	// Create privacy policy
	createPrivacyPolicy: async (data: CreatePrivacyRequest): Promise<PrivacyPolicy> => {
		console.log("🚀 [legalService] Creating privacy policy with data:", data);
		try {
			const result = await apiClient.post<PrivacyPolicy>({
				url: LegalApi.PRIVACY,
				data: { content: data.content }, // Ensure simple JSON structure
			});
			console.log("✅ [legalService] Privacy create successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Privacy create failed:", error);
			throw error;
		}
	},

	// Update privacy policy
	updatePrivacyPolicy: async (data: UpdatePrivacyRequest, id?: string): Promise<PrivacyPolicy> => {
		console.log("🔄 [legalService] Updating privacy policy with data:", data, "ID:", id);
		try {
			const url = id ? `${LegalApi.PRIVACY}/${id}` : LegalApi.PRIVACY;
			const result = await apiClient.put<PrivacyPolicy>({
				url,
				data: { content: data.content }, // Ensure simple JSON structure
			});
			console.log("✅ [legalService] Privacy update successful:", result);
			return result;
		} catch (error) {
			console.error("❌ [legalService] Privacy update failed:", error);
			throw error;
		}
	},
};

export default legalService;
