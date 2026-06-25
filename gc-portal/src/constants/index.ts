// Firestore collection names — single source of truth
export const COLLECTIONS = {
  STAFF: 'staff',
  MEMBERS: 'members',
  CAMPUSES: 'campuses',
  CREATIVE_ARTS: 'creative_arts',
  ATTENDANCE: 'attendance',
  OFFERINGS: 'offerings',
  TRANSPORT: 'transport',
  EVENTS: 'events',
} as const;

// Roles
export const ROLES = {
  ADMIN: 'Admin',
  PASTOR: 'Pastor',
  CA_LEADER: 'CA Leader',
} as const;
