/* Application Constants */

const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};

const USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
};

const POST_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  REEL: 'reel',
};

const GAME_TYPES = {
  SNAKE: 'snake',
  FLAPPY_BIRD: 'flappy_bird',
  TIC_TAC_TOE: 'tic_tac_toe',
};

const GAME_MODE = {
  SINGLE_PLAYER: 'single_player',
  MULTIPLAYER: 'multiplayer',
  AI: 'ai',
};

const NOTIFICATION_TYPE = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
  GAME_INVITE: 'game_invite',
  ACHIEVEMENT: 'achievement',
};

const POINTS_CONFIG = {
  POST_CREATION: 10,
  POST_LIKE: 1,
  GAME_WIN: 50,
  GAME_LOSS: 5,
  DAILY_LOGIN: 5,
  FOLLOW: 5,
  COMMENT: 2,
};

const BADGES = {
  FIRST_POST: 'first_post',
  GAME_MASTER: 'game_master',
  SOCIAL_BUTTERFLY: 'social_butterfly',
  STREAK_WARRIOR: 'streak_warrior',
  TOP_SCORER: 'top_scorer',
};

const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  ROLES,
  USER_STATUS,
  POST_TYPE,
  GAME_TYPES,
  GAME_MODE,
  NOTIFICATION_TYPE,
  POINTS_CONFIG,
  BADGES,
  ERROR_CODES,
  HTTP_STATUS,
};
