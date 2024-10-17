import {Timestamp} from 'firebase/firestore';

export interface RegionInterface {
  id: number;
  psgc_code: string;
  region_name: string;
  region_code: string;
}

export interface ProvinceInterface {
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
}

export interface CityInterface {
  city_code: string;
  city_name: string;
  province_code: string;
  psgc_code: string;
  region_desc: string;
}

export interface BarangayInterface {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
}

export interface UserInterface {
  id: string;
  email: string;
  fullName: string;
  birthDate: Timestamp;
  gender: string;
  imageUrl: string;
  contactNumber: string;
  role: string;
  workerApplicationStatus: string;
  isDeactivated: boolean;
  workTitle: string;
}

export interface BookingInterface {
  id: string;
  workerEmail: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerProfileImg: string;
  categoryService: string;
  specificService: string;
  additionalDetail: string;
  status: string;
  ifDoneStatus: string;
  serviceAmountPaid: string;
  rating: number;
  receiptImageUrl: string;
  createdAt: Timestamp;

  barangay: {
    code: string;
    name: string;
  };
  city: {
    code: string;
    name: string;
  };
  province: {
    code: string;
    name: string;
  };
  region: {
    code: string;
    name: string;
  };
}

export interface ChatInterface {
  id: string;
  senderId: string;
  text: string;
  senderName: string;
  senderImageUrl: string;
  timestamp: Timestamp;
  unread: boolean;
}

export interface ConversationInterface {
  conversationId: string;
  participants: string[]; // [user1Id, user2Id]
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
  conversationName: string[]; // [user1Name, user2Name]
  conversationImageUrl: string[]; // [user1ImageUrl, user2ImageUrl]
  unreadCount: number;
  createdAt: Timestamp;
}

export interface MessageInterface {
  messageId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
  type: string;
  status: string;
}

export interface DocumentInterface {
  id: string;
  email: string;
  certificateUrl: string;
  certificateFileName: string;
  licenseUrl: string;
  licenseFileName: string;
  validIdUrl: string;
  validIdFileName: string;
  createdAt: Timestamp;
}

export interface ReportInterface {
  id: string;
  customerEmail: string;
  workerEmail: string;
  reportedAt: string;
}

export interface ImageInterface {
  name: string;
  type: string;
  uri: string;
}
