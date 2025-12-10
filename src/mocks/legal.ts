export interface LegalContent {
	id: string;
	type: 'privacy-policy' | 'terms-and-conditions' | 'about-us';
	title: string;
	content: string;
	lastUpdated: string;
	updatedBy: string;
	version: string;
	status: 'draft' | 'published';
}

export const mockLegalContent: LegalContent[] = [
	{
		id: "legal-001",
		type: "privacy-policy",
		title: "Privacy Policy",
		content: `
# Privacy Policy for Fitness Solutions

**Last updated: December 10, 2024**

## 1. Information We Collect

We collect information you provide directly to us, such as when you:
- Create an account
- Use our fitness tracking features
- Contact our support team
- Subscribe to our services

### Personal Information
- Name and contact information
- Fitness goals and preferences
- Workout history and progress
- Payment information

### Automatically Collected Information
- Device information
- Usage data
- Location data (with permission)

## 2. How We Use Your Information

We use the information we collect to:
- Provide and improve our services
- Personalize your fitness experience
- Process payments
- Send important updates and notifications
- Analyze usage patterns

## 3. Information Sharing

We do not sell your personal information. We may share your information:
- With your chosen trainer (fitness data only)
- With service providers who assist us
- When required by law
- With your consent

## 4. Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 5. Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate data
- Delete your account and data
- Opt-out of communications

## 6. Contact Us

If you have questions about this Privacy Policy, contact us at:
Email: privacy@fitnesssolutions.com
Phone: +1-555-PRIVACY
		`,
		lastUpdated: "2024-12-10T10:00:00Z",
		updatedBy: "Admin",
		version: "1.2",
		status: "published"
	},
	{
		id: "legal-002",
		type: "terms-and-conditions",
		title: "Terms and Conditions",
		content: `
# Terms and Conditions

**Last updated: December 10, 2024**

## 1. Acceptance of Terms

By accessing and using Fitness Solutions app, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Service Description

Fitness Solutions is a comprehensive fitness platform that provides:
- Workout programs and tracking
- Nutrition guidance
- Personal trainer connections
- Progress monitoring

## 3. User Accounts

### Account Registration
- You must provide accurate information
- You are responsible for maintaining account security
- One account per person

### Account Responsibilities
- Keep your password confidential
- Notify us of unauthorized access
- You are liable for all account activity

## 4. Subscription Terms

### Payment
- Subscription fees are billed in advance
- All payments are non-refundable unless required by law
- Prices may change with notice

### Cancellation
- You may cancel anytime
- Cancellation takes effect at the end of the billing period
- No partial refunds for unused time

## 5. User Conduct

You agree not to:
- Use the service for illegal purposes
- Share inappropriate content
- Interfere with service operation
- Violate others' privacy

## 6. Trainer Services

### For Trainers
- Must maintain valid certifications
- Responsible for client interactions
- Comply with professional standards

### For Trainees
- Follow trainer guidance safely
- Consult healthcare providers as needed
- Report any issues promptly

## 7. Limitation of Liability

Fitness Solutions is not liable for:
- Injuries from exercise programs
- Equipment malfunctions
- Service interruptions
- Data loss

## 8. Contact Information

For questions about these Terms:
Email: legal@fitnesssolutions.com
Phone: +1-555-LEGAL
		`,
		lastUpdated: "2024-12-10T10:00:00Z",
		updatedBy: "Admin",
		version: "1.3",
		status: "published"
	},
	{
		id: "legal-003",
		type: "about-us",
		title: "About Us",
		content: `
# About Fitness Solutions

## Our Mission

At Fitness Solutions, we believe that everyone deserves access to quality fitness guidance and support. Our mission is to connect fitness enthusiasts with certified trainers and provide the tools needed to achieve health and wellness goals.

## What We Offer

### For Fitness Enthusiasts
- Personalized workout programs
- Professional trainer connections
- Progress tracking and analytics
- Nutrition guidance
- Community support

### For Fitness Trainers
- Platform to reach more clients
- Tools for program creation
- Client management system
- Payment processing
- Performance analytics

## Our Story

Founded in 2024, Fitness Solutions emerged from the vision of making professional fitness coaching accessible to everyone. Our team of fitness professionals, technologists, and health advocates work together to create an platform that truly serves the fitness community.

## Our Values

**Accessibility**: Making fitness guidance available to all
**Quality**: Connecting users with certified professionals
**Innovation**: Using technology to enhance fitness experiences
**Community**: Building supportive fitness relationships
**Results**: Focusing on measurable health outcomes

## Our Team

Our diverse team includes:
- Certified fitness trainers
- Nutrition specialists
- Software developers
- Health and wellness experts
- Customer support specialists

## Contact Us

**General Inquiries**: info@fitnesssolutions.com
**Support**: support@fitnesssolutions.com
**Trainer Applications**: trainers@fitnesssolutions.com

**Phone**: +1-555-FITNESS
**Address**: 123 Wellness Way, Health City, HC 12345

## Follow Us

Stay connected with our community:
- Instagram: @fitnesssolutions
- Facebook: /fitnesssolutions
- Twitter: @fitnessolutions
- YouTube: /fitnesssolutions

---

*Join thousands of users who have transformed their fitness journey with Fitness Solutions.*
		`,
		lastUpdated: "2024-11-15T15:30:00Z",
		updatedBy: "Admin",
		version: "1.0",
		status: "published"
	}
];