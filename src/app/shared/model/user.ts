export class User {
	code = '';
	firstName = '';
	lastName = '';
	fullName = '';
	email = '';
	mobileNumber = '';
	cipher = '';
	eligibleForPersonalityQuiz  = false;
	status = '';
	cityName: string | null = null;
	createdDate: string | null = null;
	remainingPrepayBalance = 0.0;
	avgMonthlyBill = 0.0;
	creditLimit = 0.0;
	referralCode = '';
	whatsAppNotificationEnabled  = false;
	notifyDeliveryUpdates  = false;
	orderCutoffTime : string | null = null;
	allowMultipleAddresses : boolean | null = null;
	allowAddressModification : boolean | null = null;
}