type UserModel = {
  id: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  admin: boolean;
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastRefreshTime: string;
    lastSignInTime: string;
  };
  tokensValidAfterTime: string;
  isBusy: boolean;
};

type UserDetailsModel = UserModel & {
  displayName: string;
  photoURL: string | undefined;
};

type UserModelProperties =
  | "email"
  | "emailVerified"
  | "admin"
  | "disabled"
  | "metadata"
  | "tokensValidAfterTime"
  | "isBusy";
type UserModelUpdateBooleanProperties = "emailVerified" | "admin" | "disabled";

type sendEmailTypes = "reset-password" | "verify-email";

type UserType = {
  uid: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  customClaims: {
    admin: boolean;
  }
  disabled: boolean;
  metadata: {
    creationTime: string;
    lastRefreshTime: string;
    lastSignInTime: string;
  };
  tokensValidAfterTime: string;
}
type UserDetailsType = UserType & {
  displayName: string;
  photoURL: string | undefined;
}

type ServiceTypeType = {
  id: string;
  serviceType: string;
  status: number;
  isActive: boolean;
};

type ServiceTypeFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean;
};

type sendEmailTypes = "reset-password" | "verify-email";

type BlockType = {
  blockName: string;
  description: string;
  image: string;
  id: string;
  algoliaId: string;
  isActive: boolean;
};

type BlocksFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean;
};

type SubAdminListType = {
  userType: string;
  algoliaId: string;
  emailId: string;
  profilePhoto: string;
  id: string;
  isAdmin: boolean;
  isActive: boolean;
  name: string;
  permission: string;
  uId: string;
};

type SubAdminFilterType = {
  limit?: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  userType?: string;
};

type AgencyType = {
  id: string;
  agencyName: string;
  isActive: boolean;
  location: string;
};

type AgencyFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean;
};

type AgentType = {
  id: string;
  name: string;
  email: string;
  agencyName: string;
  isActive: boolean;
  agentCommission: string;
  agencyAddress: string;
};

type AgentFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
};

type RegionType = {
  id: string;
  regionName: string;
  isActive: boolean;
};

type RegionFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean
};

type SupplierType = {
  id: string;
  supplierName: string;
  email: string;
  isActive: boolean;
};

type SupplierFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean;
};

type ServicesType = {
  id: string;
  region: string;
  serviceName: string;
  serviceType: string;
  internalCost: string;
  externalCost: string;
  isActive: boolean;
  pricePerPerson: boolean;
  supplierName: string;
  description: string;
  regionName?: string;
  startTime?: date;
  startDate?: date;
  serviceRefId?: string;
};

type ServicesFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean
};

type TermsConditionFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
};

type TermsConditionType = {
  id: string;
  description: string;
  title: string;
  isActive: boolean;
};

type eventFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  isActive?: boolean
};

type eventType = {
  id: string;
  eventDay: string;
  eventDuration: number;
  eventTitle: string;
  notes: string;
  region: string;
  isActive: boolean;
  block?: Array;
  service?: Array;
}

type eventAddNewServiceType = {
  id?: string;
  region?: string;
  serviceName?: string;
  serviceType?: string;
  internalCost?: string;
  externalCost?: string;
  isActive?: boolean;
  pricePerPerson?: boolean;
  supplierName?: string;
  description?: string;
  regionName?: string;
};

type ItineraryFilterType = {
  limit: ?number;
  search?: ?string;
  prevEndBeforeDocId?: ?string;
  nextStartAfterDocId?: ?string;
  firstDocId?: ?string;
  change?: boolean;
  page?: number;
  filterPage?: number;
  sort?: string;
  sortOrder?: string;
  emailIds?: {
    id?: string
  }[];
  bookerId?: {
    id?: string
  }[]
};

type ItineraryDayType = {
  dayRefId?: string
  isBooked?: boolean
  event?: eventType[]
}
type ItineraryVersionType = {
  agent: {
    dropeedId: string;
    name: string;
    id: string;
    isActive: boolean;
    email: string;
    agencyName: string;
  };
  noOfDay: string;
  endDate: string;
  itineraryName: string;
  editedCost: number;
  versionNumber: number;
  participantList: string[];
  timeStamp: string;
  itineraryId: number;
  day: Day[];
  startDate: string;
  participants: string;
}

type ItineraryType = {
  id?: string;
  itineraryId?: any;
  day?: ItineraryDayType[];
  itineraryName?: string;
  startDate?: string;
  endDate?: string;
  noOfDay?: number;
  participants?: string;
  participantList?: string[];
  agent?: AgentType
  // itineraryVersion?: ItineraryType[];
  itineraryVersion?: VersionType['versionData'];
  versionNumber?: string,
  editedCost?: string
  bookerEmail: string;
}

type ItineraryAppliedOwnerFilter = {
  id: string;
  userName: string
}[]

type ExportBDModalType = {
  id: string;
  cartasi?: string;
  // agencyAddress: string;
  agentCommission: string;
}