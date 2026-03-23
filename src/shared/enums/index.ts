export enum UserRole {
  VISITOR = 'visitor',
  USER = 'user',
  OWNER = 'owner',
  ADMIN = 'admin',
}

export enum ListingType {
  RENT = 'rent',
  SALE = 'sale',
}

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
  SOLD = 'sold',
  RENTED = 'rented',
}

export enum ContactMethod {
  PHONE = 'phone',
  WHATSAPP = 'whatsapp',
}

export enum ReportReason {
  FAKE = 'fake',
  INAPPROPRIATE = 'inappropriate',
  DUPLICATE = 'duplicate',
  WRONG_INFO = 'wrong_info',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  DISMISSED = 'dismissed',
  ACTIONED = 'actioned',
}

export enum AppRole {
  BUYER = 'buyer',
  TENANT = 'tenant',
  SELLER = 'seller',
  LANDLORD = 'landlord',
  AGENCY = 'agency',
}

export enum VisitStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

export enum LeadPurpose {
  BUYING = 'buying',
  RENTING = 'renting',
}
