import { Timestamp } from "firebase/firestore";

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
  age: string;
  gender: string;
  imageUrl: string;
  role: string;
  isWorkerApproved: boolean;
}

export interface BookingInterface {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerProfileImg: string;
  categoryService: string;
  specificService: string;
  additionalDetail: string;
  status: string;
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

export interface ConversationInterface {
  conversationId: string;
  participants: string[]; // [user1Id, user2Id]
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
  conversationName: string[]; // [user1Name, user2Name]
  conversationImageUrl: string[]; // [user1ImageUrl, user2ImageUrl]
  unreadCount: Record<string, number>;
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
  certificate: string;
  license: string;
  validId: string;
  createdAt: Timestamp;
}
